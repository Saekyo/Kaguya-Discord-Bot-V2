const Command = require("../../Structures/Command");

class Say extends Command {

    constructor( client ) {
        super( client, {
            name        : "say",
            description : "Send message",
            usage       : "say <text>",
            example     : ["say shut up"],
            args        : true,
            category    : "Moderation",
            cooldown    : 1000,
            userPerms   : "MANAGE_MESSAGES",
            guildOnly   : true,
        });
    }

    async run(message, args) {
        message.delete();
        message.channel.send(args.join(" "))
    }
}

module.exports = Say;
