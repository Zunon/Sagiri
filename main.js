const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var text = msg.content.toLowerCase();
  if (text.startsWith('!joinchannel')) {
    var channelName = text.split(' ')[1];
    role = msg.guild.roles.find('name', channelName);
    msg.member
      .addRole(role)
      .then(updated => {
        console.log('Added ' + channelName + ' for ' + msg.member.displayName);
        msg.reply('Added you to the `' + channelName + '` channel!');
      },
      error => {
        console.error('could not add ' + channelName + ' for ' + msg.member.displayName + '!');
        msg.reply('Could not find that channel!');
      });
  } else if (text.startsWith('!<>doRoles')) {
    var channelName = text.split(' ')[1];
    role = msg.guild.roles.find('name', channelName);
    channel = msg.guild.channels.find('name', channelName);
    channel.overwritePermissions(role, {READ_MESSAGES: true})
      .catch(error => console.error)
      .then(updated => {
        console.log('Did permissions for: ' + channelName);
      }); 
  } else if(text.startsWith('!leavechannel')) {
    var channelName = text.split(' ')[1];
    role = msg.guild.roles.find('name', channelName);
    msg.member
      .removeRole(role)
      .then(updated => {
        console.log('Removed ' + channelName + ' for ' + msg.member.displayName);
        msg.reply('Removed you from the `' + channelName + '` channel!');
      },
      error => {
        console.error('could not remove ' + channelName + ' for ' + msg.member.displayName + '!');
        msg.reply('Could not find that channel!');
      });
  }
});

client.login('NDQ2NDEwODkwNTY5MzE4NDAw.Dd4oEQ.yCm3lDUQuEdWVAeyFyhWZiu3Djg')
  .catch(error => console.error);