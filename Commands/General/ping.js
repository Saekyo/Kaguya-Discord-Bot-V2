const Command = require( "../../Structures/Command" )
	, discord = require("discord.js");

class Ping extends Command {

    constructor(client) {
        super(client, {
            name        : "ping",
            description : "Send test packets to the bot, and measures the response time",
            usage       : "ping",
            args        : false,
            category    : "General",
            cooldown    : 5000,
            aliases     : ["🏓", "pong"],
            permLevel   : 0,
            userPerms   : "SEND_MESSAGES",
            allowDMs    : true,
        });
    }

    async run(message) {

        const m = await message.channel.send("🏓Pinging...");
    
    m.edit(
      `🏓Latency is ` +
        "`" +
        `${m.createdTimestamp - message.createdTimestamp}ms` +
        "`" +
        ` | API Latency is ` +
        "`" +
        `${Math.round(this.client.ws.ping)}ms` +
        "`" +
        ``
    );
    }
}

module.exports = Ping;