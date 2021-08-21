const Command               = require( "../../Structures/Command" )
	, discord				= require( "discord.js")
    , fs                    = require( "fs" ).promises
    , os                    = require( "os" )
    , osu                   = require( "os-utils")
    , { MessageButton,
        MessageActionRow }  = require( "discord-buttons")
    , { dependencies }      = require( "../../package.json" );

class Botinfos extends Command {

    constructor( client ) {
        super( client, {
            name        : "botinfo",
            aliases     : ["infobot", "bot-info"],
            description : "Displays generic information about Kaguya",
            category    : "General",
            args        : false,
            botPerms    : "SEND_MESSAGES",
            userPerms   : "SEND_MESSAGES",
            guildOnly   : false,
        } );
    }

    async run( message ) {
        
        const { formatTime } = this.client.utils;

        // —— Function, so that at each call, the data is updated
        const embed = () => ({
            title           : this.language.title,
            description     : this.language.description,
            color           : message.guild.me.displayHexColor,
            thumbnail       : this.client.user.displayAvatarURL(),
            "fields": [{
                "name"  : "— Bot Information",
                "value" : "```" + [
                    `Bot Tag    : ${this.client.user.tag}`,
                    `Bot Id     : ${this.client.user.id}`,
                    `Created At : ${this.client.user.createdAt}`,
                ].join( "\n" ) + "```",
            }, {
                "name"  : "— Bot Statistics",
                "value" : "```" + [
                    `Servers    : ${ this.client.guilds.cache.size }`,
                    `Channels   : ${ this.client.channels.cache.size }`,
                    `Users      : ${ this.client.users.cache.size }`,
                    ////`Shards    : ${ this.client.shard && this.client.shard.count || 0 }`,
                    `Uptime     : ${ formatTime( this.client.uptime / 1000 ) }`,
                ].join( "\n" ) + "```",
            }, {
                name    : "— Host",
                "value" : "```" + [
                    `DiscordJS  : ${ dependencies["discord.js"] }`,
                    `NodeJS     : ${ process.version }`,
                    `CPU        : ${ require("os").cpus()[0].model }`,
                    `CPU Usage  : ${ ~~( osu.loadavg( 1 )) } %`,
                    `Mem Usage  : ${ ~~( process.memoryUsage().heapUsed / 1024 / 1024 ) } MB`,
                    `Arch       : ${ process.arch }`,
                    `OS         : ${ process.platform }`,
                ].join( "\n" ) + "```",
            }]
        });
    }

}

module.exports = Botinfos;