'use strict';

require('dotenv').config();

const Sensor = require('./lib/am2302');
const Influx = require('./lib/influx');
const SlackBot = require('slackbots');
const Delay = process.env.UPDATE_FREQUENCY;
let errorCount = 0;

// Create & Configure Slackbot
let bot = new SlackBot({
	token: process.env.SLACK_API_TOKEN,
	name: process.env.SLACK_BOT_NAME,
});
let channel = process.env.SLACK_CHANNEL;
let params = {
	icon_emoji: ':tfws:',
};

// bot.postMessageToGroup(channel, 'Living Room Has Started', params);

function getData() {
	Sensor.getJSON().then(Influx.writeInflux).then(function() {
        setTimeout(getData, Delay);
        errorCount = 0;

	}).catch(function(e) {
        // After 5 Errors, Stop Reporting & Die
        if (errorCount < 5) {
            console.log(e);
            //bot.postMessageToGroup(channel, e);
            setTimeout(getData, Delay);
            errorCount++;
        } else {
            console.log("Error Limit Exceeded");
            bot.postMessageToGroup(channel, "Error Limit Exceeded, You Should Restart Me When You Fix Me ");
        }
	});
};

getData();
