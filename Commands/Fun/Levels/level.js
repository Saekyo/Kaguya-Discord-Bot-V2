const Command               = require( "../../../Structures/Command" )
    , { Role, GuildMember } = require( "discord.js" );

class Level extends Command {

	constructor(client) {
		super(client, {
			name        : "level",
			description : "Allows to change the amount of experience of a member, of all the members in possession of a role or of everyone. ",
			usage       : "level user operation quantity",
			example     : ["@Simp + 100", "all = 2, @role / 2"],
			args        : true,
			category    : "Fun",
			cooldown    : 3,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

    async run( message, [ target, operation, quantity ] ) {

        // —— Array of all user ids
        let members = [];

        try {

            if ( !operation || ![ "+", "-", "*", "/", "=" ].includes( operation ) )
                return super.respond( this.language.noOperator );

            if ( !quantity || isNaN( parseInt( quantity ) ) )
                return super.respond( this.language.noQuantity );

            if ( target === "all" ) {
                members = this.message.guild.members.cache.map( ( member ) => member.user.id );
            } else {

                const resolved = await this.client.utils.resolveMention( ( target ), message.guild, 0 );

                if ( !resolved )
                    return super.respond( this.language.notFound );

                if ( resolved instanceof Role )
                    members = this.message.guild.members.cache.filter( ( member ) => member._roles.includes( resolved.id ) ).map( ( member ) => member.user.id );

                if ( resolved instanceof GuildMember )
                    members = resolved.user.id;

            }

            // —— Retrieves the information of all designated users from the database
            const toUpdate = await this.client.db.Member.find( {
                _ID         : { $in: members },
                _guildID    : message.guild.id,
            } );

            // —— Counter for the number of updated users
            let updated = 0;

            for ( const member of toUpdate ) {

                // —— The use of eval is prohibited, but in this case, it is safe
                const newLevel = operation !== "="
                    ? eval( `${member.level} ${operation} ${parseInt( quantity )}` )
                    : quantity;

                if ( newLevel < 0 || newLevel > 99 )
                    continue;

                const { ok } = await this.client.db.Member.updateOne({
                    _ID         : member._ID,
                    _guildID    : message.guild.id,
                }, {
                    experience  : ~~Math.pow( ( newLevel ) / 0.1, 2 ),
                    level       : ~~newLevel
                });

                ok === 1 && updated++;

            }

            if ( updated === 0 )
                return super.respond( this.language.noChange );

            super.respond( { embed: {

                title: this.language.updated,
                description: this.language.updatedData( updated, toUpdate )

            }} );


        } catch ( error ) {

            super.respond( this.language.error );

            console.log( error );

        }

    }

}

module.exports = Level;