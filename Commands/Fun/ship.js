const Command = require("../../Structures/Command")
    , discord = require("discord.js")
    , { shipP } = require("../../Assets/json/actions.json");

class Ship extends Command {

    constructor( client ) {
        super( client, {
            name        : "ship",
            description : "Ship Rate",
            usage       : "ship <user1> [user2]",
            example     : ["ship @histobot", "ship histobot absenbot"],
            category    : "Fun",
            cooldown    : 1000,
            userPerms   : "SEND_MESSAGES",
            guildOnly   : true,
            args        : true
        });
    }

    async run(message, args) {
      const shippp = shipP[Math.round(Math.random() * (shipP.length - 1))];
        let ship = Math.floor(Math.random() * 100) + 1;
        let robber = args[0]
        let user = args[1] || message.author
            
          if(!robber) {
            return message.channel.send("Make sure you pick a person who you want to ship!");
          }
      
      if(ship >= 50) {

        let embed = new discord.MessageEmbed()
              .setTimestamp()
              .setTitle(`${this.client.user.username}'s ship machine'`)
              .setDescription(`**${robber}** & **${user}**, your ship rate is... ${ship}%♥`)
              .setColor(message.guild.me.displayHexColor)
              .setFooter(`Ship by ${message.author.username}`)
              .setImage("https://media.discordapp.net/attachments/739051913651159071/881981047280119828/d10.jpg")
    
       return message.channel.send(embed).then(m => {
            m.react('🖤')
            m.react('🤍')            
            m.react('778254591854116864')
            m.react('💙')
            m.react('❤')
              })  

      } else {

        let embed = new discord.MessageEmbed()
              .setTimestamp()
              .setTitle(`${this.client.user.username}'s ship machine'`)
              .setDescription(`**${robber}** & **${user}**, your ship rate is... ${ship}%♥`)
              .setColor(message.guild.me.displayHexColor)
              .setFooter(`Ship by ${message.author.username}`)
              .setImage(shippp)
    
       return message.channel.send(embed).then(m => {
            m.react('776127606244245508')
            m.react('778253901795033089')            
            m.react('778251644612902932')
              })  
      
            } 
    }
}

module.exports = Ship;