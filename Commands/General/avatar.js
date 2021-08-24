const { GuildMember }   = require( "discord.js" )
    , Command           = require( "../../Structures/Command" );

class Avatar extends Command {

    constructor( client ) {
        super( client, {
            name        : "avatar",
            description : "Returns the profile image of a player. Targeting by mention, username, or ID",
            usage       : "avatar {@mention || username || ID}",
            example     : ["662331369392832512", "@Simp", "Simp"],
            args        : false,
            category    : "General",
            cooldown    : 1000,
            aliases     : ["av"],
            userPerms   : "SEND_MESSAGES",
            guildOnly   : false,
        } );
    }

    async run( message, [ target ] ) {
        

        // —— If the user uses an id, transforms it into a mention
        target = parseInt( target ) ? `<@${target}>` : target;

        // —— Try to retrieve an ID against a mention, a username or an ID, if nothing is found, use author's ID
        let user = await this.client.utils.resolveMention( ( target || `<@${message.author.id}>` ), this.client, 1 );

        if ( !user )
            return super.respond( this.language.noUserInformation );

        user = user instanceof GuildMember ? user.user : user;
        
    let png = user.displayAvatarURL({
      format: "png",
      dynamic: true
    });

    let jpg = user.displayAvatarURL({
      format: "jpg",
      dynamic: true
    });

    let gif = user.displayAvatarURL({
      format: "gif",
      dynamic: true
    });

    let jpeg = user.displayAvatarURL({
      format: "jpeg",
      dynamic: true
    });
     
   let webp = user.displayAvatarURL({
      format: "webp",
      dynamic: true
    });
        
        super.respond({ embed: {
            color: message.guild.me.displayHexColor,
            description: `${this.language.thisIs} ${message.author.id === user.id ? this.language.userIsAuthor( user ) : this.language.userAvatar( user ) }
[PNG](${png}) | [JPG](${jpg}) | [GIF](${gif}) | [JPEG](${jpeg}) | [WEBP](${webp})`,
            image: {
                url: user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }),
            },
        } });

    }
}

module.exports = Avatar;