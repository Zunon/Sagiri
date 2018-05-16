const Discord = require(`discord.js`);
const client = new Discord.Client();

client.on(`ready`, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(`message`, message => {
  if(message.content.startsWith('!')) {
    var text = message.content.toLowerCase().split(` `);
    var command = text[0].substr(1);
    text.shift();
    
    switch(command) {
      case `joinchannel`:
        joinChannel(message, text);
        break;
      case `leavechannel`:
        leaveChannel(message, text);
        break;
      case `doroles`:
        doRoles(message, text);
        break;
      default:
        message.reply("sorry I didn't recognize that command.");
    }
  }
});

client.login(`NDQ2NDEwODkwNTY5MzE4NDAw.Dd4oEQ.yCm3lDUQuEdWVAeyFyhWZiu3Djg`)
  .catch(error => {
    console.error(`Couldn't log in!\n${error}`);
    process.exit();
  });

function joinChannel(message, text) {
  text.forEach(channelName => {
    var role = message.guild.roles.find(`name`, channelName);
    message.member
      .addRole(role)
      .then(updated => {
        console.log(`Added ${channelName} for ${message.member.displayName}`);
        message.reply(`Added you to the \`${channelName}\` channel!`);
      },
      error => {
        console.error(`could not add ${channelName} for ${message.member.displayName}!`);
        message.reply(`Could not find that channel!`);
      });
  });
}

function leaveChannel(message, text) {
  text.forEach( channelName => {
    role = message.guild.roles.find(`name`, channelName);
    message.member
      .removeRole(role)
      .then(updated => {
        console.log(`Removed ${channelName} for ${message.member.displayName}`);
        message.reply(`removed you from the \`${channelName}\` channel!`);
      },

      error => {
        console.error(`could not remove ${channelName} for ${message.member.displayName}!`);
        message.reply(`could not find that channel!`);
      });
  });
}

function doRoles(message, text) {
  text.forEach(channelName => {
    role = message.guild.roles.find(`name`, channelName);
    channel = message.guild.channels.find(`name`, channelName);
    channel.overwritePermissions(role, {READ_MESSAGES: true})
      .then(updated => {
        console.log(`Did permissions for: ${channelName}`);
      },
    
      error => {
        console.error(`Couldn't manage ${channelName}!`)
      }); 
  })
}