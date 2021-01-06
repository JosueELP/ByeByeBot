require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
//for videos
const ytdl = require('ytdl-core');
let enabled = true;
let videos = ["https://www.youtube.com/watch?v=b8PxzPxI8Os", "https://www.youtube.com/watch?v=m-YVD8GUhr8"];

client.login(process.env.BOT_TOKEN);

client.once('ready', () => {
	console.log('Ready!');
});

//consts used for prexis commands
const prefix = '&';
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//message method
client.on('message', message => {
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    //Commands section!
    //If you plan to add more than 6-7 commands, consider refactor the code
    //to make the commands code more readable like it's specified in the Discord.JS guide.
	if(command === 'enable'){
        enabled = true;
        message.channel.send('ByeByeBot services are up! :)');
        
    } else if (command === 'disable') {
        enabled = false;
        message.channel.send('ByeByeBot has been suspended :(');
        
	} else if (command === 'status') {
        message.reply(`ByeByeBot is currently \`${enabled ? "enabled" : "disabled"}\`.`);
        
	} else if (command === 'help') {
        message.reply(`you can either ping me or use \`${prefix}\` as my prefix.`);
        
	} else if(command === 'commands'){
        message.reply(`Hi, these are my avaliable commands at the moment: `);
        message.channel.send(`${"enable"}: to activate my services`);
        message.channel.send(`${"disable"}: to stop my services`);
        message.channel.send(`${"status"}: to show if I'm on service or not`);
        message.channel.send(`${"help"}: to tell you what's the prefix you should use to call me \n (between you and me, that last command is not very helpful at all!)`);
    }
});


//Voice state update method
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
    if(oldChannel !== null && newChannel === null && isBot === false && enabled && voiceChannel.members.size > 0){
        voiceChannel.join()
            .then(connection => {
                const stream = ytdl(getRandom(), { filter: 'audioonly' });
                const dispatcher = connection.play(stream);
                //on finish()
                dispatcher.on('finish', () => voiceChannel.leave());
            })
            .catch(console.error);
    }

    //debug stuff
    /*
    * console.log("-----------------");
    * console.log(voiceChannel);
    * console.log("-----------------");
    */
});

//return random number
function getRandom(){
    let length = videos.length;
    let random = Math.floor(Math.random() * length);
    return videos[random];
}