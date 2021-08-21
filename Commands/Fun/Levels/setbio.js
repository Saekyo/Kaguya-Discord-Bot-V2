const Command = require( "../../../Structures/Command" );

class Setbio extends Command {

	constructor(client) {
		super(client, {
			name        : "setbio",
			description : "Defines your profile phrase on a server",
			usage       : "setbio { message }",
			example     : [ "Progamer" ],
			cooldown    : 5,
			userPerms   : "SEND_MESSAGES",
			allowDMs    : false,
		});

	}

	async run( message, [ ...bio ] ) {

        try {

            const cleanBio = bio.join( " " ).substring( 0, 96 );

            const { n, ok } = await this.client.db.Member.updateOne({
                _ID         : message.author.id,
                _guildID    : message.guild.id
            }, {
                $set: { bio: cleanBio }
            });

            message.inlineReply( this.language[ ( !n || !ok ) ? "unchanged" : "ok" ] );

        } catch ( error ) {

            super.respond( this.language.error );

        }

    }

}

module.exports = Setbio;