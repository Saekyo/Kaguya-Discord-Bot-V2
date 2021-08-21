const Command               = require( "../../Structures/Command" )
	, Discord 				= require('discord.js')
    , fs                    = require( "fs" ).promises
    , os                    = require( "os" )
    , osu                   = require( "os-utils")
const dbs = require("discord-buttons");
//dbs(client);
const { MessageMenuOption, MessageMenu } = require("discord-buttons")

class MemePostingRole extends Command {

    constructor( client ) {
        super( client, {
            name        : "rrm",
            description : "Displays all Kaguya commands",
            category    : "General",
            args        : false,
            botPerms    : "SEND_MESSAGES",
            userPerms   : "SEND_MESSAGES",
            guildOnly   : true,
            ownerOnly	: true
        } );
    }

    async run( message ) {

        // First Option In Menu
            const Role1 = new MessageMenuOption()
            .setLabel('Ping Coding') // Label
            .setDescription('Get Coding Ping Role') // Description, Limit Is 50
            .setEmoji('781551330685878312') // Emoji ID
            .setValue('coding') // To Make Its Funtion When Use Click It

            // Second Option In Menu
            const Role2 = new MessageMenuOption()
            .setLabel('Ping Game') // Label
            .setDescription('Get Game Ping Role') // Description, Limit Is 50
            .setEmoji('778254345313321031') // Emoji ID
            .setValue('game') // To Make Its Funtion When Use Click It

            // Third Option In Menu
            const Role3 = new MessageMenuOption()
            .setLabel('Ping Task') // Label
            .setDescription('Get Task Ping Role') // Description, Limit Is 50
            .setEmoji('781551629232766988') // Emoji ID
            .setValue('task') // To Make Its Funtion When Use Click It
            
        let selection = new MessageMenu()
            .setID("Selection")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Select Roles By Choosing Options Below In Menu")
            .addOption(Role1)
            .addOption(Role2)
            .addOption(Role3)
        
        let embed = new Discord.MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setTitle("Ping Roles")

        let menumsg = await message.channel.send(embed, selection)

//        function menuselection(menu) {
//            switch(menu.values[0]) {
//                case "coding": 
//                    menu.reply.send("Added Coding Ping Role", true)
//                break;
//                case "game": 
//                    menu.reply.send("Added Game Ping Role", true)
//                break;
//                case "task": 
//                    menu.reply.send("Added Task Ping Role", true)
//	              break;
//            }
//        }

        this.client.on("clickMenu", (menu) => {
          //  if(menu.message.id == menumsg.id) {
          //      if(menu.clicker.user.id == message.author.id) menuselection(menu)
          //      else menu.reply.send("You are not allowed to pick something", true)
          //  }           
            
            let role = menu.clicker.member.roles;

            if(menu.values[0] === 'coding') {
                if (role.cache.has("776263953986486282")) {
                	role.remove("776263953986486282");
                	menu.reply.send(`Removed the role <@&776263953986486282>`, true);
            	} else {
                	role.add("776263953986486282");
                	menu.reply.send(`Gave the role <@&776263953986486282>`, true);
            	}    
                    //menu.clicker.member.roles.add('776263953986486282') 
                    
                } else if(menu.values[0] === 'game') { 
                    //menu.clicker.member.roles.add('776093882160250922')
                    if (role.cache.has("776093882160250922")) {
                	role.remove("776093882160250922");
                	menu.reply.send(`Removed the role <@&776093882160250922>`, true);
            	} else {
                	role.add("776093882160250922");
                	menu.reply.send(`Gave the role <@&776093882160250922>`, true);
            	}    
                    
                } else if(menu.values[0] === 'task') {
                    //menu.clicker.member.roles.add('776093844441399326')
                    	if (role.cache.has("776093844441399326")) {
                			role.remove("776093844441399326");
                			menu.reply.send(`Removed the role <@&776093844441399326>`, true);
            			} else {
                			role.add("776093844441399326");
                			menu.reply.send(`Gave the role <@&776093844441399326>`, true);
            	}
        		}
    })
                       
                       }
}

                       

module.exports = MemePostingRole;