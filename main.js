const Discord = require(`discord.js`)
const client = new Discord.Client()

client.on(`ready`, () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on(`message`, message => {
  if(message.content.startsWith('!')) {
    var text = message.content.toLowerCase().split(` `)
    var command = text[0].substr(1)
    text.shift()
    
    switch(command) {
      case `joinchannel`:
        joinChannel(message, text)
        break
      case `leavechannel`:
        leaveChannel(message, text)
        break
      case `doroles`:
        if (authenticate(message.member)) {
          doRoles(message)
        } else {
            message.reply('you must be an authorized user to use this command!')
        }
        break
      case `prune`:
        if (authenticate(message.member)) {
          prune(message.channel, parseInt(text[0]) + 1)
        } else {
          message.reply('you must be an authorized user to use this command!')
        }
        break
      default:
        message.reply("sorry I didn't recognize that command.")
    }
  }
})

client.login(`NDQ2NDEwODkwNTY5MzE4NDAw.Dd4oEQ.yCm3lDUQuEdWVAeyFyhWZiu3Djg`)
  .catch(error => {
    console.error(`Couldn't log in!\n${error}`)
    process.exit()
})

function joinChannel(message, text) {
  text.forEach(channelName => {
    var role = message.guild.roles.find(`name`, channelName)
    message.member
      .addRole(role)
      .then(updated => {
        console.log(`Added ${channelName} for ${message.member.displayName}`)
        message.reply(`Added you to the \`${channelName}\` channel!`)
      },
      error => {
        console.error(`could not add ${channelName} for ${message.member.displayName}!`)
        message.reply(`Could not find that channel!`)
      })
  })
}

function leaveChannel(message, text) {
  text.forEach( channelName => {
    role = message.guild.roles.find(`name`, channelName)
    message.member
      .removeRole(role)
      .then(updated => {
        console.log(`Removed ${channelName} for ${message.member.displayName}`)
        message.reply(`removed you from the \`${channelName}\` channel!`)
      },

      error => {
        console.error(`could not remove ${channelName} for ${message.member.displayName}!`)
        message.reply(`could not find that channel!`)
      })
  })
}

function doRoles(message) {
  var guild = message.guild;
  deleteAllRoles(guild);
  client.channels.get(`442729303935811584`).children.forEach(channel => {
    channel.roles
    guild.createRole({name: channel.name}).then(role => {
      channel.overwritePermissions(role, {READ_MESSAGES: true})
        .then(() => {
          console.log(`Did permissions for: ${channel.name}`)
        },
        () => {
          console.error(`Couldn't manage ${channel.name}`)
        }  
      )
    })
  })
}

function prune(channel, numberOfMessages) {
  channel.fetchMessages({ limit: numberOfMessages }).then(messages => {
    messages.forEach(message => {
      message.delete()
    })
  })
}

function authenticate(user) {
  return user.id === '95623672072511488'
}

function deleteAllRoles(guild) {
  guild.roles.forEach(role => {
    role.delete();
  })
}