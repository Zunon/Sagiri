const Discord = require(`discord.js`)
const handler = require('./handlers')
const client = new Discord.Client()

client.on(`error`, console.error)

client.on(`message`, message => {
  if(message.content.startsWith('!')) {
    var text = message.content.toLowerCase().split(` `)
    var command = text[0].substr(1)
    text.shift()
    
    switch(command) {
      case `joinchannel`:
        handler.joinChannel(message, text)
        break
      case `leavechannel`:
        handler.leaveChannel(message, text)
        break
      case `doroles`:
        if (handler.authenticate(message.member)) {
          handler.doRoles(message)
        } else {
            message.reply('you must be an authorized user to use this command!')
        }
        break
      case `prune`:
        if (handler.authenticate(message.member)) {
          handler.prune(message.channel, parseInt(text[0]) + 1)
        } else {
          message.reply('you must be an authorized user to use this command!')
        }
        break
      default:
        message.reply("sorry I didn't recognize that command.")
    }
  }
})

client.on(`ready`, () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(`NDQ2NDEwODkwNTY5MzE4NDAw.Dd4oEQ.yCm3lDUQuEdWVAeyFyhWZiu3Djg`)
  .catch(error => {
    console.error(`Couldn't log in!\n${error}`)
})