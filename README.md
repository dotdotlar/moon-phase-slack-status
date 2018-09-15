# moon-phase-slack-status
Set your status on Slack based on the current lunar phase.

## How does it work?

The script uses a sun/moon calculation library to get the current phase (floating point from 0.0 to 0.99999).  Based upon this value, it sets the Slack status to one of the following: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter or Waning Crescent.  The actual strings and Slack status emoji are set in [config.js](./config.js).

## How to run it?
Currently only works on Windows and macOS only

You need to obtain a Slack token for your account from https://api.slack.com/custom-integrations/legacy-tokens.

You also need to have node.js installed to run the script. Currently it works on Windows and macOS only.
Install nodejs using this link: https://nodejs.org/en/download/

- Clone or download this repository
- Install dependencies with `npm install`
- Copy and paste the token into [config.js] slackToken variable
- Run with `npm start`

## Things to know

Be careful with defining a updateInterval value that is too low. Slack will block requests for status change if done too frequently.  Since the phases of the moon don't change that fast, an interval of several hours is fine.  Recommend 12 hours (1000 \* 60 \* 60 \* 12).


Run this program as a service (in Windows) using NSSM (the Non Sucking Service Manager) at http://nssm.cc/.  Or use the Windows Task Scheduler to run once per day.

Run as a cron job on Linux or have .bashrc kick it off in the background using the "-s" (stay resident) flag.

## Shoutout
Thanks to Hendrik Beenker (beenker) for his Slack setting code: https://github.com/Indivirtual/wifi-based-slack-status

Thanks to Vladimir Agafonkin (mourner) for his sun/moon library: https://github.com/mourner/suncalc
