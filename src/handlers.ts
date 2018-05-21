/*
  ------------ IMPORTS, INSTANCES, AND VARIABLES ------------
*/
import { Message, Client, Channel, CategoryChannel, TextChannel, Role, Collection, GuildMember, Guild, User } from "discord.js"
const reactionEvents = {
  MESSAGE_REACTION_ADD: `messageReactionAdd`,
  MESSAGE_REACTION_REMOVE: `messageReactionRemove`
}
/*
  ------------ FUNCTIONS ------------
*/
/**
 * Add requested channel-role(s) to the user
 * @param user User or GuildMember object to add the role to
 * @param guild Guild object
 * @param channels List of role-channels to add
 */
export function joinChannel(user: GuildMember | User, guild: Guild, channels: string[]) {
  channels.forEach((channelName: string) => { // Iterate over requested channels
    let role: Role = guild.roles.find(`name`, channelName) // Find the needed role
    guild.members.get(user.id) // Get the GuildMember object
      .addRole(role) // Add the needed role to it
      .then(
        () => { // If role addition was a success, print out on console and reply the confirmation
          console.log(`Added ${channelName} for ${user.id}`)
          user.send(`Added you to the \`${channelName}\` channel!`)
        },
        () => { // If role addition was a failure, print out on console and reply the (un)confirmation(?)
          console.error(`could not add ${channelName} for ${user.id}!`)
          user.send(`Could not find that channel!`)
        }
      )
    }
  )
}
/**
 * Remove requested channel-role(s) to the user
 * @param user User or GuildMember object to add the role to
 * @param guild Guild object
 * @param channels List of role-channels to add
 */
export function leaveChannel(user: GuildMember | User, guild: Guild, channels: string[]) {
  channels.forEach((channelName: string) => { // Iterate over requested channels
    let role: Role = guild.roles.find(`name`, channelName) // Find the needed role
    guild.members.get(user.id) // Get the GuildMember object
      .removeRole(role) // Add the needed role to it
      .then(
        () => { // If role addition was a success, print out on console and reply the confirmation
          console.log(`Removed ${channelName} for ${user.id}`)
          user.send(`Removed you from the \`${channelName}\` channel!`)
        },
        () => { // If role addition was a failure, print out on console and reply the (un)confirmation(?)
          console.error(`could not remove ${channelName} for ${user.id}!`)
          user.send(`Could not find that channel!`)
        }
      )
    }
  )
}
/**
 * Re-create roles for the "ONGOING DISCUSSION" channel category
 * @param guild Guild object
 */
export function doRoles(guild: Guild) {
  deleteAllRoles(guild) // delete all existing roles to prevent role duplication
  // Get the CategoryChannel object for the "ONGOING DISCUSSION" channel category
  let ongoingChannelCategory: CategoryChannel = guild.channels.get(`442729303935811584`) as CategoryChannel
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
 * Filter through raw event data and emit messageReactionAdd and messageReactionRemove on non-cached messages
 * @param rawEvent Raw event object to filter
 * @param client Bot Client object
 * @listens messageReactionAdd
 * @listens messageReactionRemove
 */
export async function rawReactionEmitter(rawEvent: any, client: Client) {
  if(!reactionEvents.hasOwnProperty(rawEvent.t)) {
    return
  }

  const
    { d: data } = rawEvent,
    user: User = client.users.get(data.user_id),
    channel: TextChannel = client.channels.get(data.channel_id) as TextChannel

  if(channel.messages.has(data.message_id)) {
    return
  }

  const
    message: Message = await channel.fetchMessage(data.message_id),
    emojiKey: string = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name,
    reaction = message.reactions.get(emojiKey)
  
  client.emit(reactionEvents[rawEvent.t], reaction, user)
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