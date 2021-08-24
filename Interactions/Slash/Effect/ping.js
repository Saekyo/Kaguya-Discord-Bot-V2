const Command = require( "../../../Structures/Command" )

class Ping extends Command {

    constructor( client ) {
        super( client, {
            name: "ping",
        });
    }

    async run( interaction, message ) {

        if ( !this.client.guilds.cache.has( interaction.guild_id ) )
            return;

        const guild = this.client.guilds.cache.get( interaction.guild_id );

        if ( !guild.channels.cache.has( interaction.channel_id ) )
            return;
        const orgChan = guild.channels.cache.get( interaction.channel_id );
        ////orgChan.send(`${this.client.ws.ping}ms`);
        this.client.api.interactions( interaction.id, interaction.token ).callback.post( { data: {
                type: 4,
                data: { content: `${this.client.ws.ping}ms` }
            }});
    }
}

module.exports = Ping;