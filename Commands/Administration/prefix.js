const Command = require( "../../Structures/Command" );

class Prefix extends Command {

	constructor(client) {
		super(client, {
			name        : "prefix",
			description : "Change the prefix used by Kaguya in the guild",
			usage       : "prefix [prefix]",
			example     : ["!"],
			args        : true,
			category    : "Administration",
			cooldown    : 10000,
			userPerms   : "ADMINISTRATOR",
			guildOnly   : true,
		});

	}

	async run( message, [ prefix ] ) {

        try {

            // —— Removes backslashes & applies changes
            prefix = prefix.replace( /\\/g, "" );

            if ( prefix === message.guild.prefix )
                return message.inlineReply( this.language.alreadyUse );

            // —— Save the new prefix in the database
            await this.client.db.Guild.findOneAndUpdate({
                _ID : this.message.guild.id
            }, {
                prefix,
            }).exec();

            this.message.guild.prefix = prefix;

            // —— Send a confirmation message
            message.inlineReply( { embed: {
                color		: message.guild.me.displayHexColor,
                author: {
                    name: this.language.changed
                },
                description : this.language.newPrefix( prefix )
            }} );

        } catch ( error ) {

            message.inlineReply({ embed : {
                color		: message.guild.me.displayHexColor,
                author: {
                    name: this.language.notModified
                },
                description : this.language.error
            }});

        }

    }
}

module.exports = Prefix;