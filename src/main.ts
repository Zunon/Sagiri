/*
  ------------ IMPORTS, INSTANCES, AND VARIABLES ------------
*/
import { Client, Message, TextChannel, MessageReaction, User, Channel, GuildMember } from "discord.js" // Import needed classes from discord.js library
import { joinChannel, leaveChannel, doRoles, prune, authenticate, rawReactionEmitter } from "./handlers" // import methods from my handler library
import config from "../config"
// Instantiate a client to use it
const client: Client = new Client()
/*
  ------------ LISTENERS ------------
*/
/**
 * Spit out unhandled errors without panicking
 * @listens error
 * @todo Replace it to handle specific error events as they arise
 */
client.on(`error`, (error: ErrorEvent) => console.error(`ERROR: ${error.message}`))
/**
 * Parse commands and fires the appropriate handler
 * @listens message
 */
client.on(`message`, (message: Message) => {
  // Check if message is a command
  if(message.content.startsWith(config.prefix)) {
    // Splits message into command and arguments
    var text: string[] = message.content.toLowerCase().split(` `)
    var command: string = text[0].substr(1)
    text.shift()
    // Matches command with known commands
    switch(command) {
      /*
        If it's a public command, it fires the handler straight away
        and passes the message object and the arguments passed into
        the command
      */
      /**
       * joinchannel and leavechannel commands
       * @deprecated
       * @todo Remove at the start of summer 2018
       */
      case `joinchannel`:
        joinChannel(message.member, message.guild, text)
        break
      case `leavechannel`:
        leaveChannel(message.member, message.guild, text)
        break
      /*
        If it's a command that requires elevation, it first checks
        that the user who sent the command passes the authentication
        function, and then it fires the handler with the appropriate
        arguments
      */
      case `doroles`:
        if (authenticate(message.member)) {
          doRoles(message.guild)
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
      // If the command wasn't recognized, it replies saying that the command wasn't recognized
      default:
        message.reply("sorry I didn't recognize that command.")
    }
  }
})
/**
 * Handle adding reactions
 */
client.on(`messageReactionAdd`, (reaction: MessageReaction, user: GuildMember) => {
  if(reaction.message.channel.id === config.channelList) {
    joinChannel(user, reaction.message.guild, reaction.message.content.split(` `, 1))
  }
})
/**
 * Handle removing reactions
 */
client.on(`messageReactionRemove`, (reaction: MessageReaction, user: GuildMember) => {
  if(reaction.message.channel.id === config.channelList) {
    leaveChannel(user, reaction.message.guild, reaction.message.content.split(` `, 1))
  }
})
client.on(`raw`, rawEvent => rawReactionEmitter(rawEvent, client))
/**
 * As soon as the bot is up and ready, confirm to console
 * @listens ready
 */
client.on(`ready`, () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
/*
  ------------ EXECUTIONS ------------
*/
// Attempt to login by reading token from file
client.login(config.token)