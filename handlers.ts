/*
  ------------ IMPORTS, INSTANCES, AND VARIABLES ------------
*/
import { Message, Client, Channel, CategoryChannel, TextChannel, Role, Collection, GuildMember, Guild } from "discord.js"
/*
  ------------ FUNCTIONS ------------
*/
/**
 * Add requested channel-role(s) to the user who sent the message
 * @param message Message object that contained the command
 * @param channels Array of requested channel names
 */
export function joinChannel(message: Message, channels: string[]) {
  channels.forEach((channelName: string) => { // Iterate over requested channels
    let role: Role = message.guild.roles.find(`name`, channelName) // Find the needed role
    message.member // Get the GuildMember object
      .addRole(role) // Add the needed role to it
      .then(
        () => { // If role addition was a success, print out on console and reply the confirmation
          console.log(`Added ${channelName} for ${message.member.displayName}`)
          message.reply(`Added you to the \`${channelName}\` channel!`)
        },
        () => { // If role addition was a failure, print out on console and reply the (un)confirmation(?)
          console.error(`could not add ${channelName} for ${message.member.displayName}!`)
          message.reply(`Could not find that channel!`)
        }
      )
    }
  )
}
/**
 * Remove requested channel-role(s) to the user who sent the message
 * @param message Message object that contained the command
 * @param channels Array of requested channel names
 */
export function leaveChannel(message: Message, channels: string[]) {
  channels.forEach((channelName: string) => { // Iterate over requested channels
    let role: Role = message.guild.roles.find(`name`, channelName) // Find the needed role
    message.member // Get the GuildMember object
      .removeRole(role) // Remove the needed role from it
      .then(
        () => { // If role removal was a success, print out on console and reply the confirmation
          console.log(`Removed ${channelName} for ${message.member.displayName}`)
          message.reply(`removed you from the \`${channelName}\` channel!`)
        },
        () => { // If role removal was a failure, print out on console and reply the (un)confirmation(?)
        console.error(`could not remove ${channelName} for ${message.member.displayName}!`)
        message.reply(`could not find that channel!`)
        }
      )
    }
  )
}
/**
 * Re-create roles for the "ONGOING DISCUSSION" channel category
 * @param message Message object that contained the command
 * @param client Client object for the bot
 */
export function doRoles(message: Message, client: Client) {
  var guild = message.guild // get the Guild object
  deleteAllRoles(guild) // delete all existing roles to prevent role duplication
  // Get the CategoryChannel object for the "ONGOING DISCUSSION" channel category
  let ongoingChannelCategory: CategoryChannel = client.channels.get(`442729303935811584`) as CategoryChannel
  ongoingChannelCategory.children.forEach((channel: TextChannel) => { // Iterate over the TextChannels inside it
    // Create a role that has the same name as the channel
    guild.createRole({ name: channel.name }).then((role: Role) => { // If role creation is a success
      // Allow members of that role to view the channel, print out the result to the console
      channel.overwritePermissions(role, { READ_MESSAGES: true })
        .then(
          () => {
            console.log(`Did permissions for: ${channel.name}`)
          },
          () => {
            console.error(`Couldn't manage ${channel.name}`)
          }
        )
      }
    )
    }
  )
}
/**
 * Prune a specific number of previous messages
 * @param channel TextChannel object of the channel that will be pruned
 * @param numberOfMessages Number of messages that will be pruned
 */
export function prune(channel: TextChannel, numberOfMessages: number) {
  channel.fetchMessages({ limit: numberOfMessages }).then((messages: Collection<string, Message>) => {
    messages.forEach((message: Message) => {
      message.delete()
    })
    channel.send(`Pruning ${numberOfMessages - 1} messages!`)
      .then((reply: Message) => {
        reply.delete(3000)
      }
    )
  })
}
/**
 * Check that a user is allowed to use elevated commands
 * @param user User object that will be authenticated
 * @todo Check for unterfuhrers and fuhrers as well
 */
export function authenticate(user: GuildMember) {
  return user.id === '95623672072511488'
}
/**
 * Delete all roles in a guild
 * @param guild Guild object
 * @todo Only delete roles that relate to "ONGOING DISCUSSION" channel category
 */
function deleteAllRoles(guild: Guild) {
  guild.roles.forEach(role => {
    role.delete()
  })
}