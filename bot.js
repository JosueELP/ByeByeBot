require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.once('ready', () => {
	console.log('Ready!');
});


client.on('voiceStateUpdate', (oldState, newState) => {
    let oldChannel = oldState.member.voice.channelID;
    let newChannel = newState.member.voice.channelID;

    let channel = client.channels.cache.get('398167945248899086');

    if(oldChannel === null && newChannel === null){
        channel.send("-play https://www.youtube.com/watch?v=b8PxzPxI8Os");
    }
});