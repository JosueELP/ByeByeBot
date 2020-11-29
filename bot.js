require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
//for videos
const ytdl = require('ytdl-core');

client.login(process.env.BOT_TOKEN);

client.once('ready', () => {
	console.log('Ready!');
});


client.on('voiceStateUpdate', (oldState, newState) => {
    let oldChannel = oldState.channel;
    let newChannel = newState.channel;
    let isBot = oldState.member.user.bot;
    let voiceChannel = client.channels.cache.get("398167945248899088"); //default voicheChannel to play

    //Get the users current voiceChannel
    if(oldChannel !== null){
        voiceChannel = client.channels.cache.get(oldState.channelID);
    }else if(newChannel !== null){
        voiceChannel = client.channels.cache.get(newChannel.channelID);
    }

    //Check if a user disconects from voice channel
    if(oldChannel !== null && newChannel === null && isBot === false){
        voiceChannel.join()
            .then(connection => {
                const stream = ytdl('https://www.youtube.com/watch?v=b8PxzPxI8Os', { filter: 'audioonly' });
                const dispatcher = connection.play(stream);
                //on finish()
                dispatcher.on('finish', () => voiceChannel.leave());
            })
            .catch(console.error);
    }

    //debug stuff
    console.log("-----------------");
    console.log(voiceChannel);
    console.log("-----------------");
});