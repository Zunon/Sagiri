import { Message, Client, Channel, CategoryChannel, TextChannel, Role, Collection, GuildMember, Guild } from "discord.js"

export function joinChannel(message: Message, text: string[]) {
  text.forEach((channelName: string) => {
    let role = message.guild.roles.find(`name`, channelName)
    message.member
      .addRole(role)
      .then(
        () => {
          console.log(`Added ${channelName} for ${message.member.displayName}`)
          message.reply(`Added you to the \`${channelName}\` channel!`)
        },
        () => {
          console.error(`could not add ${channelName} for ${message.member.displayName}!`)
          message.reply(`Could not find that channel!`)
        }
      )
    }
  )
}

export function leaveChannel(message: Message, text: string[]) {
  text.forEach((channelName: string) => {
    let role: Role = message.guild.roles.find(`name`, channelName)
    message.member
      .removeRole(role)
      .then(
        () => {
          console.log(`Removed ${channelName} for ${message.member.displayName}`)
          message.reply(`removed you from the \`${channelName}\` channel!`)
        },
        () => {
        console.error(`could not remove ${channelName} for ${message.member.displayName}!`)
        message.reply(`could not find that channel!`)
        }
      )
    }
  )
}

export function doRoles(message: Message, client: Client) {
  var guild = message.guild
  deleteAllRoles(guild)
  let ongoingChannelCategory: CategoryChannel = client.channels.get(`442729303935811584`) as CategoryChannel
  ongoingChannelCategory.children.forEach((channel: TextChannel) => {
    guild.createRole({ name: channel.name }).then((role: Role) => {
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

export function prune(channel: TextChannel, numberOfMessages: number) {
  channel.fetchMessages({ limit: numberOfMessages }).then((messages: Collection<string, Message>) => {
    messages.forEach((message: Message) => {
      message.delete()
    })
    channel.send(`Successfully pruned ${numberOfMessages - 1} messages!`)
      .then((reply: Message) => {
        reply.delete(3000)
      }
    )
  })
}

export function authenticate(user: GuildMember) {
  return user.id === '95623672072511488'
}

function deleteAllRoles(guild: Guild) {
  guild.roles.forEach(role => {
    role.delete()
  })
}