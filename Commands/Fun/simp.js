const Command = require("../../Structures/Command")
    , discord = require("discord.js")
    , { GuildMember }   = require( "discord.js" );

class Simp extends Command {

    constructor( client ) {
        super( client, {
            name        : "simp",
            description : "Simp Rate",
            usage       : "[user]",
            example     : ["simp @HistoBot"],
            category    : "Fun",
            cooldown    : 1000,
            userPerms   : "SEND_MESSAGES",
            guildOnly   : true,
        });
    }

    async run(message, [ target ]) {
        
        target = parseInt( target ) ? `<@${target}>` : target;

        let user = await this.client.utils.resolveMention( ( target || `<@${message.author.id}>` ), this.client, 1 );

        if ( !user )
            return message.inlineReply(`User Not Found`);

        user = user instanceof GuildMember ? user.user : user;

        let simp = Math.floor(Math.random() * 100) + 1;
      
      if(simp >= 50){
        let embed = new discord.MessageEmbed()
               .setTimestamp()
               .setTitle(`${this.client.user.username}'s simp machine`)
               .setDescription(`**${user.username}** simp rate is... ${simp}%`)
               .setImage(`https://some-random-api.ml/canvas/simpcard?avatar=${user.displayAvatarURL()}`)
               .setColor(message.guild.me.displayHexColor)
               
        return message.channel.send(embed)
      } else {
        let embed = new discord.MessageEmbed()
               .setTimestamp()
               .setTitle(`${this.client.user.username}'s simp machine`)
               .setDescription(`**${user.username}**, you get an award because you are not simp and your simp rate is... ${simp}%`)
               .setImage(`https://media.discordapp.net/attachments/739051913651159071/881963019809214464/unknown.png`)
               .setColor(message.guild.me.displayHexColor)
               
         return message.channel.send(embed)
      }
         
    }
}

module.exports = Simp;