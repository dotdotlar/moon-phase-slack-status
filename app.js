"use strict";

const os = require('os');
const axios = require("axios");
const execSync = require("child_process").execSync;
const querystring = require("querystring");
const config = require("./config");
const suncalc = require("suncalc");

var printf = require('printf');

if (!config.slackToken) {
    console.error("Missing Slack token. Set it in config.js");
    process.exit(1);
}

function getMoonPhase(timeAndDate) {

    var phaseName = "";

    if (timeAndDate != null) {

        var illumObj = suncalc.getMoonIllumination(timeAndDate);

        if (illumObj != null) {
            if ((illumObj.phase <= 0.05) || (illumObj.phase >= 0.97)) {
                phaseName = "newmoon";
            }
            else if ((illumObj.phase >= 0.05) && (illumObj.phase < 0.22)) {
                phaseName = "waxingcrescent";
            }
            else if ((illumObj.phase >= 0.22) && (illumObj.phase <= 0.28)) {
                phaseName = "firstquarter";
            }
            else if ((illumObj.phase > 0.28) && (illumObj.phase < 0.47)) {
                phaseName = "waxinggibbous";
            }
            else if ((illumObj.phase >= 0.47) && (illumObj.phase <= 0.53)) {
                phaseName = "fullmoon";
            }
            else if ((illumObj.phase > 0.53) && (illumObj.phase < 0.72)) {
                phaseName = "waninggibbous";
            }
            else if ((illumObj.phase >= 0.72) && (illumObj.phase <= 0.78)) {
                phaseName = "lastquarter";
            }
            else if ((illumObj.phase > 0.78) && (illumObj.phase < 0.97)) {
                phaseName = "waningcrescent";
            }
        }
    }
    return(phaseName);
}

function setSlackStatus(token, status) {
    return axios.post("https://slack.com/api/users.profile.set",
        querystring.stringify({
            token: token,
            profile: JSON.stringify(status)
        }), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(function(response) {
            // console.log("Set Slack status API response: %j", response.data);
        })
        .catch(function(error) {
            console.error("Set Slack status error: %s", error);
        });
}

var printPhaseStatus = function() {
    var currDateTime = new Date();
    var phaseName = getMoonPhase(currDateTime);
    var illumObj = suncalc.getMoonIllumination(currDateTime);
    console.log(currDateTime.toLocaleString() + ": Moon phase data: percent=%f, name=%s\n",illumObj.phase,phaseName);
}

var getPhaseSetStatus = function() {
    var phaseName = getMoonPhase(new Date());
    if (phaseName != "") {
        setSlackStatus(config.slackToken, config.statusByPhase[phaseName]);
    }
}

function checkInternetNameResolution() {
    console.log("Checking DNS resolution of slack.com");
    require('dns').resolve('slack.com', function(err) {
        console.log("err=" + err);
        if (err) {
            console.log("Cannot resolve slack.com address");
            process.exit(1);
        } 
    });
}

/*
 * "-s" means "Stay resident", running every config.interval
 */

// checkInternetNameResolution();

if (process.argv[2] == "-p") {
    printPhaseStatus();
}
else if (process.argv[2] == "-s") {
//    checkInternetNameResolution();
    getPhaseSetStatus();
    setInterval(getPhaseSetStatus, config.updateInterval);
}
else {
    // call it once.  Assume user has set up cron job or task scheduler
//    checkInternetNameResolution();
    getPhaseSetStatus();
}
