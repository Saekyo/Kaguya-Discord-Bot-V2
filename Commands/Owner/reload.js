const Command = require( "../../Structures/Command" );
class Reload extends Command {

    constructor( client ) {
        super( client, {
            name        : "reload",
            description : "Reload events and commands.",
            usage       : "reload",
            args        : false,
            category    : "Owner",
            userPerms   : "SEND_MESSAGES",
            ownerOnly   : true
        } );
    }

    async run( message ) {

        try {

            this.client.language.clear();
            await this.client.loadLanguages();

            this.client.commands.clear();
            this.client.aliases.clear();
            await this.client.loadCommands();

            await message.react( "778429578850730004" );

        } catch ( error ) {

            super.respond( `\`\`\`${error}\`\`\`` );

        }

    }
}

module.exports = Reload;