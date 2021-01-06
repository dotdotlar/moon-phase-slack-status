module.exports = {
    slackToken: "xoxp-...........-...........-............-................................", # replace with your own Slack API token
    statusByPhase: {
        "newmoon": {
          "status_text": "New Moon",
           "status_emoji": ":new_moon:"
        },
        "waxingcrescent": {
           "status_text": "Waxing Crescent",
           "status_emoji": ":waxing_crescent_moon:"
        },
        "firstquarter": {
            "status_text": "First Quarter",
            "status_emoji": ":first_quarter_moon:"
        },
        "waxinggibbous": {
           "status_text": "Waxing Gibbous",
           "status_emoji": ":waxing_gibbous_moon:"
        },
        "fullmoon": {
            "status_text": "Full Moon",
            "status_emoji": ":full_moon:"
        },
        "waninggibbous": {
            "status_text": "Waning Gibbous",
            "status_emoji": ":waning_gibbous_moon:"
        },
        "lastquarter": {
            "status_text": "Last Quarter",
            "status_emoji": ":last_quarter_moon:"
        },
        "waningcrescent": {
            "status_text": "Waning Crescent",
            "status_emoji": ":waning_crescent_moon:"
        }
    },
    // updateInterval: 1800000 // every 30 minutes
    // updateInterval: 3600000 // every 60 minutes
    // updateInterval: 3600000 // every 60 minutes
    updateInterval: 43200000 // 12 hours
    // updateInterval: 86400000 // 24 hours
};
