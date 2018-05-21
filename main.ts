import { Client, Message, TextChannel } from "discord.js"
import { joinChannel, leaveChannel, doRoles, prune, authenticate } from "./handlers"

const client: Client = new Client()

client.on(`error`, console.error)

client.on(`message`, (message: Message) => {
  if(message.content.startsWith('!')) {
    var text: string[] = message.content.toLowerCase().split(` `)
    var command: string = text[0].substr(1)
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
          doRoles(message, client)
        } else {
            message.reply('you must be an authorized user to use this command!')
        }
        break
      case `prune`:
        if (authenticate(message.member)) {
          prune(message.channel as TextChannel, parseInt(text[0]) + 1)
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
  }
)