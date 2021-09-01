const Command = require("../../Structures/Command")
    , Discord = require("discord.js")
    , moment = require("moment")
    , { MessageEmbed } = require("discord.js");

class UserInfo extends Command {

    constructor(client) {
        super(client, {
            name: "userinfo",
            description: "Get user information",
            usage: "userinfo [@user]",
            category: "General",
            cooldown: 5000,
            aliases: ["user-info"],
            userPerms: "SEND_MESSAGES",
        });
    }

    async run(message) {

        let userArray = message.content.split(" ");
        let userArgs = userArray.slice(1);
        let user =
            message.mentions.members.first() ||
            message.guild.members.cache.get(userArgs[0]) ||
            message.guild.members.cache.find(
                x =>
                x.user.username.toLowerCase() === userArgs.slice(0).join(" ") ||
                x.user.username === userArgs[0]
            ) ||
            message.member;

        let stat = {
            online: "https://emoji.gg/assets/emoji/9166_online.png",
            Idle: "https://emoji.gg/assets/emoji/3929_idle.png",
            dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
            offline: "https://emoji.gg/assets/emoji/7445_status_offline.png"
        };

        // —— Badges
        const BADGES = {
            DISCORD_EMPLOYEE: "<:B_DiscordStaff:817507921684070420>",
            DISCORD_PARTNER: "<:B_DiscordPartner:817507880709128234>",
            BUGHUNTER_LEVEL_1: "<:B_BugHunter:817507991879942184>",
            HYPESQUAD_EVENTS: "<:B_HypesquadEvents:817508047626829844>",
            HOUSE_BRAVERY: "<:B_Bravery:817508210167644179>",
            HOUSE_BRILLIANCE: "<:B_Brilliance:817508260692885536>",
            HOUSE_BALANCE: "<:B_Balance:817508314576846880>",
            EARLY_SUPPORTER: "<:B_Supporter:817508419158278245>",
            VERIFIED_BOT: "<:B_BotTag:817507827236995112>",
            VERIFIED_DEVELOPER: "<:B_DiscordDev:817508366229307402>"
        };
        let userFlags;
        if (user.user.flags === null) {
            userFlags = "";
        } else {
            userFlags = user.user.flags.toArray();
        }

        //let badges = await user.user.flags;
        //badges = await badges.toArray();

        //    let newbadges = [];
        //    badges.forEach(m => {
        //      newbadges.push(m.replace("_", " "));
        //    });
        // .addField("❯ Badges", newbadges.join(", ").toLowerCase() || "None")

        let embed = new MessageEmbed().setThumbnail(
            user.user.displayAvatarURL({
                dynamic: true
            })
        );

        // —— Activity
        let array = [];
        if (user.user.presence.activities.length) {
            let data = user.user.presence.activities;

            for (let i = 0; i < data.length; i++) {
                let name = data[i].name || "None";
                let xname = data[i].details || "None";
                let zname = data[i].state || "None";
                let type = data[i].type;

                array.push(`❯ **${type}** \n \`${name} : ${xname} : ${zname}\``);

                if (data[i].name === "Spotify") {
                    embed.setThumbnail(
                        `https://i.scdn.co/image/${data[i].assets.largeImage.replace(
              "spotify:",
              ""
            )}`
                    );
                }

                embed.setDescription(array.join("\n"));
            }
        }

        // —— Roles
        const trimArray = (arr, maxLen = 10) => {
            if (arr.length > maxLen) {
                const len = arr.length - maxLen;
                arr = arr.slice(0, maxLen);
                arr.push(` and ${len} more roles...`);
            }
            return arr;
        };

        const roles = user.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);

        // —— Embed Color
        embed.setColor(
            user.displayHexColor === "#000000" ? "#ffffff" : user.displayHexColor
        );

        embed.setAuthor(
            user.user.tag,
            user.user.displayAvatarURL({
                dynamic: true
            })
        );

        if (user.nickname !== null) embed.addField("❯ Nickname", user.nickname);
        embed
            .addField(
                "❯ Joined At",
                moment.utc(user.joinedAt).format("dddd, MMMM Do YYYY, HH:mm")
            )
            .addField(
                "❯ Account Created At",
                moment(user.user.createdAt).format("LLLL")
            )
            .addField(
                "❯ Common Information",
                `ID: \`${user.user.id}\`\nDiscriminator: ${user.user.discriminator}\nBot: ${user.user.bot}\nDeleted User: ${user.deleted}`
            )
            .addField(
                "❯ Badges",
                `${
          userFlags.length
            ? userFlags.map(flag => BADGES[flag]).join("")
            : "None"
        }`
            )

            .setFooter(user.user.presence.status, stat[user.user.presence.status]);
        embed.addField(
            "❯ Highest Role",
            `${
        user.roles.highest.id === message.guild.id ? "None" : user.roles.highest
      }`
        );
        embed.addField(
            "❯ Roles",
            `${
        roles.length < 10
          ? roles.join(", ")
          : roles.length > 10
          ? trimArray(roles).join(", ")
          : "None"
      }`
        );
        embed.setTimestamp();

        return message.channel.send(embed).catch(err => {
            return message.channel.send("Error : " + err);
        });
    }
}

module.exports = UserInfo;