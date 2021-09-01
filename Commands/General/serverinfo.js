const Command = require( "../../Structures/Command" )
	, Discord = require("discord.js")
    , moment = require("moment")
    , { MessageEmbed } = require("discord.js");

class ServerInfo extends Command {

    constructor(client) {
        super(client, {
            name        : "serverinfo",
            description : "Get guild information",
            category    : "General",
            cooldown    : 5000,
            aliases     : ["server-info", "guildinfo", "guild-info"],
            userPerms   : "SEND_MESSAGES",
        });
    }

    async run(message) {
     
     const { guild, channel } = message;

    const roles = guild.roles.cache.size;
    const channels = guild.channels.cache.size;
    const emojis = guild.emojis.cache.size;

   // const channelType = type => {
   //   return (channelTypes = guild.channels.cache.filter(channels => {
   //     return channels.type === type;
   //   }));
   // };

    const memberPresences = status => {
      return guild.members.cache.filter(members => {
        return members.presence.status === status;
      });
    };

    const guildEmojis = boolean => {
      return guild.emojis.cache.filter(emojis => {
        return emojis.animated == boolean;
      });
    };

    const serverInfo = {
      name: guild.name,
      id: guild.id,
      memberCount:
        guild.memberCount === 1
          ? `${guild.memberCount} User/Bot`
          : `${guild.memberCount} Users/Bots`,
      created: new Date(guild.createdTimestamp),
      owner: guild.owner.user.tag,
      icon: guild.icon,
      boosters:
        guild.premiumSubscriptionCount === 0
          ? "No Boosters"
          : `<:Nitro_Diamond:809049472092209173>${guild.premiumSubscriptionCount} Boosters`,
      roleCount: roles === 1 ? `${roles} role` : `${roles} roles`,
      //channels: {
        //Categorys: channelType("category").size,
        //TextChannels: channelType("text").size,
        //VoiceChannels: channelType("voice").size
      //},
      //channelCount: channels,
      memberStatus: {
        idle: memberPresences("idle").size,
        dnd: memberPresences("dnd").size,
        online: memberPresences("online").size,
        offline: memberPresences("offline").size
      },
      emojis: {
        totalEmojis: emojis,
        animated: guildEmojis(true).size,
        notAnimated: guildEmojis(false).size
      }
    };
    
      let users = message.guild.members.cache.filter(member => !member.user.bot).size
      let onlineUsers = message.guild.members.cache.filter(member => !member.user.bot).filter(member => member.presence.status !== "offline").size
      let bots = message.guild.members.cache.filter(member => member.user.bot).size
      let onlineBots = message.guild.members.cache.filter(member => member.user.bot).filter(member => member.presence.status !== "offline").size
      const region = {
           "brazil": "Brazil :flag_br:",
           "europe": "Europe :flag_eu:",
           "india": "India :flag_in:",
           "japan": "Japan :flag_jp:",
           "singapore": "Singapore :flag_sg:",
           "us-central": "US-Central :flag_us:",
           "us-east": "US-East :flag_us:",
           "us-south": "US-South :flag_us:",
           "us-west": "US-West :flag_us:",
           "sydney": "Sydney :flag_au:",
           "hongkong": "Hong Kong :flag_hk:",
           "russia": "Russia :flag_ru:",
           "southafrica": "South Africa :flag_za:"
       };
    
        const titleCase = str => {
            return str.toLowerCase().replace(/_/g, " ").split(" ")
                      .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
                      .join(" ")
        }

    channel.send(
      new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
        //.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=4096`)
        .setAuthor(
          `Server Info "${serverInfo.name}"`,
          message.guild.iconURL({ format: "png", dynamic: true })
        )
        .addFields(
          { name: "❯ Region", value: `${region[message.guild.region]}`, inline: true},
          { name: "❯ Users/Bots Count", value: `${serverInfo.memberCount}\n(${serverInfo.memberStatus.online} Online) (${serverInfo.memberStatus.idle} Idle)\n(${serverInfo.memberStatus.dnd} DND) (${serverInfo.memberStatus.offline} Offline)`, inline: true},
          { name: "❯ Users", value: `${users} Users (${onlineUsers} Online)`, inline: true },
          { name: "❯ Bots", value: `${bots} Bots (${onlineBots} Online)`, inline: true },
          { name: "❯ Boosters", value: `${serverInfo.boosters}  (Tier ${message.guild.premiumTier})`, inline: true },
          { name: "❯ Emoji", value: `${serverInfo.emojis.totalEmojis} Emojis (${serverInfo.emojis.animated} Animated) (${serverInfo.emojis.notAnimated} Not Animated)`, inline: true},
          //{ name: "❯ Categories", value: `${serverInfo.channels.Categorys}`, inline: true },
          //{ name: "❯ Text Channels", value: `${serverInfo.channels.TextChannels}`, inline: true },
          //{ name: "❯ Voice Channels", value: `${serverInfo.channels.VoiceChannels}`, inline: true },
          { name: "❯ Verification Level", value: `${titleCase(message.guild.verificationLevel)}`, inline: true },
          { name: "❯ AFK Timeout", value: (message.guild.afkChannel) ? `${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minute(s)` : "None", inline: true },
          { name: "❯ AFK Channel", value: (message.guild.afkChannel) ? `${message.guild.afkChannel.name}` : "None", inline: true },
          { name: "❯ Explicit Content Filter", value: `${titleCase(message.guild.explicitContentFilter)}`, inline: true },
          { name: "❯ Roles", value: `${serverInfo.roleCount}`, inline: true },
          { name: "❯ Server Owner", value: `[${message.guild.owner.user.tag}](https://discord.com/users/${message.guild.owner.user.id} "https://discord.com/users/${message.guild.owner.user.id}")`, inline: true }
        )
        .setFooter(`• ID ${serverInfo.id}`)
        .setTimestamp()
    );
    
    }
}

module.exports = ServerInfo;
