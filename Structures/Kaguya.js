// —— Inline Reply
const ProtoTypes = require ("./ProtoTypes.js");
ProtoTypes.start();

const { Client, Collection, Intents } = require( "discord.js" )
    , mongoose               = require( "mongoose" )
    , path                   = require( "path" )
    , glob                   = require( "glob" )
    , gradient               = require( "gradient-string" )
    , chalk                  = require( "chalk" );

const Command       = require( "./Command.js" )
    , Event         = require( "./Event.js" )
    , Interaction   = require( "./Interaction" )
    , Guild         = require( "./Guild" );

class Kaguya extends Client {

    constructor( options = {} ) {

        // —— Initialise discord.js client
        super( {
            ...options,
            disableMentions: 'everyone',
            intents: [
                Intents.ALL,
            ],
            ws: { intents: Intents.ALL }
        });

        // —— Import of the parameters required for operation
        this.config    = require( "../config.js" );
        // —— Collection of all commands
        this.commands  = new Collection();
        // —— Collection of all slash commands
        this.slash     = new Collection();
        // —— Collection of all command aliases
        this.aliases   = new Collection();
        // —— Loads the language dictionary
        this.language  = new Collection();
        // —— Import custom function ( avoid duplicated block )
        this.utils     = new ( require( "../Structures/Utils" ) )( this );

        this.disbut = require('discord-buttons')( this );

        console.clear();

        
        console.log(
            chalk.bold(
                gradient("#8EA6DB", "#7354F6")([
                    ".",
                    "..",
                    "...",
                    "\n",
                ].join("\n")),
            )
            + `Client initialised —— Node ${process.version}.\n`
        );


    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    async loadDatabase() {

        try {

            await mongoose.connect(this.config.mongodb, {
                useNewUrlParser     : true,
                useUnifiedTopology  : true,
                useFindAndModify    : false,
                useCreateIndex      : true
            });


            glob.sync( `${this.directory}/Models/*.js` ).forEach( ( file ) => {
                require( path.resolve( file ) );
            });

            this.db = mongoose.connection.models;

            console.log(`Database —— Loaded`)
        } catch (error) {
            throw new Error(error);
        }

    }

    loadLanguages() {

        for ( const language of glob.sync( `${this.directory}/Languages/**/*.js` ) ) {

            const match = language.match(/.*\/([A-Z]{2})\//);

            if ( !match[1] )
                return;

            const ISO = match[1];

            if (!this.language[ISO])
                this.language[ISO] = {};

            delete require.cache[ language ];
            const file = require( path.resolve( language ) )
                , name = language.slice( language.lastIndexOf("/") + 1, language.lastIndexOf(".") );

            this.language[ISO][name] = file;

        }
        console.log(`Languages —— Loaded`)

    }

    // —— Events Handler

    loadEvents() {

        for (const event of glob.sync( `${this.directory}/Events/**/*.js` )) {

            delete require.cache[ event ];
            const file = new ( require( path.resolve( event ) ) )( this );

            if ( !( file instanceof Event ) )
                return;

            super[ file.listener ]( file.name, ( ...args )  => file.run( ...args ) );

        }
        console.log(`Events —— Loaded`)

    }

    loadInteractions() {

        for (const interactions of glob.sync( `${this.directory}/Interactions/*.js` )) {

            delete require.cache[ interactions ];
            const file = new ( require( path.resolve( interactions ) ) )( this );

            if ( !( file instanceof Interaction ) )
                return;

            this.ws[ file.listener ]( file.name, ( ...args )  => file.run( ...args ) );

        }
        console.log(`Interactions —— Loaded`)

    }

    // –– Commands Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––

    loadCommands() {

        for (const command of glob.sync(`${this.directory}/Commands/**/*.js`)) {

            delete require.cache[ command ];
            const file = new ( require( path.resolve( command ) ) )( this );

            if ( !( file instanceof Command ) )
                return;

            this.commands.set( file.name, file );

            if ( file.aliases && Array.isArray( file.aliases ) )
                file.aliases.forEach( ( alias ) => this.aliases.set( alias, file.name ) );

        }
        console.log(`Commands —— Loaded`)

    }

    login() {

        if ( !this.config.Token )
            throw new Error( "You must pass the token for the client..." );

        // —— Logs the client
        super.login( this.config.Token );

    }

    async start() {

        await this.loadDatabase();
        this.loadLanguages();
        this.loadInteractions();
        this.loadCommands();
        this.loadEvents();
        this.login();

    }

}

module.exports = Kaguya;