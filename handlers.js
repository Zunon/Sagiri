module.exports = {

  joinChannel: (message, text) => {
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
  },

  leaveChannel: (message, text) => {
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
  },

  doRoles: (message) => {
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
  },

  prune: (channel, numberOfMessages) => {
    channel.fetchMessages({ limit: numberOfMessages }).then(messages => {
      messages.forEach(message => {
        message.delete()
      })
    })
  },

  authenticate: (user) => {
    return user.id === '95623672072511488'
  }
}
function deleteAllRoles(guild) {
  guild.roles.forEach(role => {
    role.delete();
  })
}