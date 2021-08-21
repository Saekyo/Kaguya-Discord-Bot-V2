const Command = require( "../../Structures/Command" );

class Autorole extends Command {

	constructor(client) {
		super(client, {
			name        : "autorole",
			description : "Defines the roles assigned automatically when a new member joins",
			usage       : "autorole [operation] [role]",
			example     : ["on", "add @moderator", "remove @moderator", "v", "off"],
			args        : true,
			category    : "Administration",
			cooldown    : 100,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

	async run( message, [ operation, ...roles ] ) {

        // —— Enable or disable automatic role assignment
        if ( ["on", "off"].includes( operation ) ) {

            try {

                const state = operation === "on" ? true : false;

                // —— Disables or enables in the database
                const req = await this.client.db.Guild.updateOne(
                    { _ID: message.guild.id },
                    { $set : { "plugins.autorole.enabled": state } }
                );

                // —— Retrieve all roles
                const { plugins: { autorole : { roles: currentRoles } } } = await this.client.db.Guild.findOne( {_ID: message.guild.id}, "plugins.autorole.roles" );

                super.respond( { embed: req.nModified
                    ? state
                        ? {
                            color		: message.guild.me.displayHexColor,
                            title: this.language.enabled,
                            description: this.language.currentRoles( currentRoles )
                        } : {
                            color		: message.guild.me.displayHexColor,
                            title: this.language.disabled,
                        }
                    : {
                        title: this.language.noChanges( operation )
                } } );

            } catch ( error ) {

                message.inlineReply( this.language.error );

            }

        }

        // —— Add or remove a role
        if ( ["a", "add", "r", "remove"].includes( operation ) ) {

            try {

                const { resolveMention } = this.client.utils;
                const cantAdd = [];

                // —— Validates all mentions entered by the user
                let roleslist = ( await Promise.all( roles.map( async ( role ) => {

                    return await resolveMention( role, message.guild, 2 );

                }) ) ).filter( ( role ) => {

                    // —— Bot can't give roles above her own
                    if ( role && role.comparePositionTo( message.guild.me.roles.highest ) < 0 )
                        return role;
                    else
                        cantAdd.push( role );

                } );

                if ( cantAdd.length )
                    return message.inlinreReply( { embed: {
                        color		: message.guild.me.displayHexColor,
                        title       : this.language.missPerms,
                        description : this.language.cantAdd( cantAdd )
                    } });

                if ( !roleslist.length )
                    return message.inlineReply( this.language.nothingToAdd );

                // —— Retrieves information, and updates it. If the action is on "add", the role is added, otherwise, it is removed
                const req = await this.client.db.Guild.findOneAndUpdate(
                    { _ID: message.guild.id },
                    ["a", "add"].includes( operation )
                        ? { $addToSet   : { "plugins.autorole.roles": { $each: roleslist } } }
                        : { $pull       : { "plugins.autorole.roles": { $in: roleslist } } },
                    { new : true }
                );

                const confirmation = { embed: {
                    color		: message.guild.me.displayHexColor,
                    title       : this.language.assigned( req.plugins.autorole.roles.length ),
                    description : `${ req.plugins.autorole.roles.map( ( role ) => `<@&${role}>` ).join( " " ) }`
                } };

                if ( req.plugins.autorole.enabled === false )
                    confirmation.embed.footer = {
                        color		: message.guild.me.displayHexColor,
                        text: this.language.notEnabled
                    };

                message.inlinreReply( confirmation );

            } catch ( error ) {

                message.inlineReply( this.language.error );

            }

        }

        if ( ["v", "view"].includes( operation ) ) {

            const { plugins : { autorole: { roles }}} = await this.client.db.Guild.findOne({
                _ID: message.guild.id
            }, "plugins.autorole.roles");

            super.respond({ embed: {
                color		: message.guild.me.displayHexColor,
                title       : this.language.assigned( roles.length ),
                description : roles.map( ( role ) => `<@&${role}>`).join(", ")
            }});

        }

    }
}

module.exports = Autorole;