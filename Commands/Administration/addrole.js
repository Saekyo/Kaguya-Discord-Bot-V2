const Command = require( "../../Structures/Command" );

class Addrole extends Command {

	constructor( client ) {
		super( client, {
			name        : "addrole",
			description : "Lets you assign a role to a member.",
			usage       : "addrole { user mention / user ID } { role mention / role ID }",
			example     : ["@Saekyo @moderator" ],
			args        : true,
			category    : "Administration",
			cooldown    : 100,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

	async run( message, [ target, ...roles ] ) {

        if ( !target )
            return message.inlineReply( this.language.noTarget );

        if ( !roles.length )
            return message.inlineReply( this.language.noRole );

        const { resolveMention } = this.client.utils;

        const member = await resolveMention( target, message.guild, 1 );

        if ( !member )
            return message.inlineReply( this.language.noValidMember );

        const added = [];

        for ( const role of roles ) {

            try {

                const resolved = await resolveMention( role, message.guild, 2 );

                if ( !resolved || resolved.comparePositionTo( member.roles.highest ) > 0 )
                    continue;

                member.roles.add( resolved );
                added.push( role );

            } catch ( err ) { ( err ) => err; }

        }

        message.inlineReplyNoMention( added.length
            ? this.language.added( added )
            : this.language.nothing
        );

    }

}

module.exports = Addrole;