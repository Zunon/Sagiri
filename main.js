const Discord = require(`discord.js`);
const client = new Discord.Client();

client.on(`ready`, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(`message`, msg => {
  var text = msg.content.toLowerCase().split(` `);
  var command = text[0];
  text.shift();
  
  switch(command) {
    case `!joinchannel`:
      joinChannel(msg, text);
      break;
    case `!leavechannel`:
      leaveChannel(msg, text);
      break;
    case `!doroles`:
      doRoles(msg, text);
      break;
  }
});

client.login(`NDQ2NDEwODkwNTY5MzE4NDAw.Dd4oEQ.yCm3lDUQuEdWVAeyFyhWZiu3Djg`)
  .catch(error => console.error);

function joinChannel(message, text) {
  text.forEach(channelName => {
    var role = message.guild.roles.find(`name`, channelName);
    message.member
      .addRole(role)
      .then(updated => {
        console.log(`Added ${channelName} for ${message.member.displayName}`);
        msg.reply(`Added you to the \`${channelName}\` channel!`);
      },
      error => {
        console.error(`could not add ${channelName} for ${message.member.displayName}!`);
        msg.reply(`Could not find that channel!`);
      });
  });
}

function leaveChannel(message, text) {
  text.forEach( channelName => {
    role = msg.guild.roles.find(`name`, channelName);
    msg.member
      .removeRole(role)

      .then(updated => {
        console.log(`Removed ${channelName} for ${message.member.displayName}`);
        msg.reply(`removed you from the \`${channelName}\` channel!`);
      },

      error => {
        console.error(`could not remove ${channelName} for ${msg.member.displayName}!`);
        msg.reply(`could not find that channel!`);
      });
  });
}

function doRoles(message, text) {
  text.forEach(channelName => {
    role = msg.guild.roles.find(`name`, channelName);
    channel = msg.guild.channels.find(`name`, channelName);
    channel.overwritePermissions(role, {READ_MESSAGES: true})
      .catch(error => console.error)
      .then(updated => {
        console.log(`Did permissions for: ${channelName}`);
      }); 
  })
}