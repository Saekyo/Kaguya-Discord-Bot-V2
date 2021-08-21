const Command = require( "../../Structures/Command" );

class Language extends Command {

	constructor( client ) {
		super( client, {
			name        : "language",
			description : "Change the language used by Kaguya in the guild",
            aliases		: ["bahasa"],
			usage       : "language [language]",
			example     : ["ID"],
			args        : false,
			category    : "Administration",
			cooldown    : 10000,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
            ownerOnly   : true
		});

	}

	async run( message, [ language ] ) {

        const available = Object.keys( this.client.language );

        if ( language && available.includes( language ) ) {

            return await this.save( language );

        } else {

            const awaitReponse = await super.respond({ embed: {
                color		: message.guild.me.displayHexColor,
                title       : this.language.choose,
                description : available.map( ( lang ) => {

                        const { ISO, name } = this.client.language[lang].informations;
                        return `\` ${ISO} \` : ${name} `;

                    }).join( "\n" ),

                footer      : {
                    text    : this.language.howUse,
                }
            }});

            const collector = message.channel.createMessageCollector(
                ( m ) => available.includes( m.content ) && m.author.id === message.author.id,
                { time: 15000, max: 1 }
            );

            collector.on( "collect", async ( m ) => { await this.save( m.content ); } );

            collector.on( "end", ( ) => awaitReponse.delete( ) );

        }

    }

    async save ( language ) {

        // —— Save the new language in the database
        await this.client.db.Guild.findOneAndUpdate({
            _ID : this.message.guild.id
        }, {
            language,
        }).exec();

        this.message.guild.language = language;

        // —— Send a confirmation message
        await super.respond( { embed: {
            color		: message.guild.me.displayHexColor,
            author: {
                name: this.client.language[language].language.done
            },
            description : this.client.language[language].language.new
        }} );

    }
}

module.exports = Language;