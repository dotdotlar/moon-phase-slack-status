"use strict";

const os = require('os');
const axios = require("axios");
const execSync = require("child_process").execSync;
const querystring = require("querystring");
const config = require("./config");
const suncalc = require("suncalc");

if (!config.slackToken) {
    console.error("Missing Slack token. Set it in config.js");
    process.exit(1);
}

function getMoonPhase(timeAndDate) {

    var phaseName = "";

    if (timeAndDate != null) {

        var illumObj = suncalc.getMoonIllumination(timeAndDate);

        if (illumObj != null) {
            if ((illumObj.phase <= 0.02) || (illumObj.phase >= 0.98)) {
                phaseName = "newmoon";
            }
            else if ((illumObj.phase > 0.02) && (illumObj.phase < 0.23)) {
                phaseName = "waxingcrescent";
            }
            else if ((illumObj.phase >= 0.23) && (illumObj.phase <= 0.27)) {
                phaseName = "firstquarter";
            }
            else if ((illumObj.phase > 0.27) && (illumObj.phase < 0.48)) {
                phaseName = "waxinggibbous";
            }
            else if ((illumObj.phase >= 0.48) && (illumObj.phase <= 0.52)) {
                phaseName = "fullmoon";
            }
            else if ((illumObj.phase > 0.52) && (illumObj.phase < 0.73)) {
                phaseName = "waninggibbous";
            }
            else if ((illumObj.phase >= 0.73) && (illumObj.phase <= 0.77)) {
                phaseName = "lastquarter";
            }
            else if ((illumObj.phase > 0.77) && (illumObj.phase < 0.98)) {
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
            console.log("Set Slack status API response: %j", response.data);
        })
        .catch(function(error) {
            console.error("Set Slack status error: %s", error);
        });
}

var getPhaseSetStatus = function() {
    var phaseName = getMoonPhase(new Date());
    if (phaseName != "") {
        setSlackStatus(config.slackToken, config.statusByPhase[phaseName]);
    }
}

/*
 * "-s" means "Stay resident", running every config.interval
 */

if (process.argv[2] == "-s") {
    console.log("Staying resident.  Interval is %d seconds",(config.updateInterval/1000));
    getPhaseSetStatus();
    setInterval(getPhaseSetStatus, config.updateInterval);
}
else {
    // call it once.  Assume user has set up cron job or task scheduler
    getPhaseSetStatus();
}
