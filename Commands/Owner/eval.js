const Command = require( "../../Structures/Command" )
    , Discord = require("discord.js")
    ,{ post } = require("node-superfetch");


class Eval extends Command {
		constructor( client ) {
		super( client, {
			name        : "eval",
			description : "Evaluate javascript code.",
			usage       : "eval `<code>`, eval `<code>` --async, eval `<code>` --async --silent, eval `<code>` --silent",
			example     : ["eval `new String(\"Hello...\")`"],
			args        : true,
			category    : "Owner",
			userPerms   : "ADMINISTRATOR",
            ownerOnly	: true,
		});
        }

	async run( message, args ) {
    
    const { query, flags } = parseQuery(args);
    
    if (!query.length) return message.inlineReply(`__**${message.author.username}**__, please include the code.`);
    
    let input = query.join(" ");
    
    const embed = new Discord.MessageEmbed()
    .setTitle("Evaluate Code");
    if (input.length > 2048) {
        const { body } = await post("https://paste.mod.gg/documents").send(input);
        embed.setDescription(`:inbox_tray: **Input:**\nhttps://paste.mod.gg/${body.key}.js`);
    } else {
        embed.setDescription(":inbox_tray: **Input:**\n" + "```js\n" + input + "```");
    }
    
    try {
        if (flags.includes("async")) {
            input = `(async () => { ${input} })()`;
        }
        
        let { evaled, type } = await parseEval(eval(input));
        
        let depth = 0;
        
        if (flags.some(input => input.includes("depth"))) {
            depth = flags.find(number => number.includes("depth")).split("=")[1];
            depth = parseInt(depth, 10);
        }
        
        if (flags.includes("silent")) return;
        
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth });
        
        let output = evaled.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        
        if (output.length > 1024) {
            const { body } = await post("https://paste.mod.gg/documents").send(output);
            embed.addField(":outbox_tray: **Output:**", `https://paste.mod.gg/${body.key}.js`);
        } else if (input.includes("TOKEN") || input.includes("process.env")) {
            embed.addField(":outbox_tray: **Output:**", "```diff\n- Oops! Its private, sorry...```");
        } else {
            embed.addField(":outbox_tray: **Output:**", "```js\n" + output + "```");
        }
        embed.addField(":label: Type:", "```ts\n" + "\u200B" + type + "```");
        embed.setFooter("React to delete message.");
        
        message.channel.send(embed).then(function(msg) {
            msg.react("778429346071052298");
            
            const filter = (reaction, user) => reaction.emoji.id === "778429346071052298" && user.id === message.author.id;
            
            msg.createReactionCollector(filter, { time: 30000, max: 1 }).on("collect", async collected => {
                if (collected.emoji.id === "778429346071052298") return msg.delete();
            });
        });
    } catch(error) {
        if (error.length > 1024) {
            const { body } = await post("https://paste.mod.gg/documents").send(error);
            embed.addField(":outbox_tray: **Output:**", `https://paste.mod.gg/${body.key}.js`);
        } else {
            embed.addField(":outbox_tray: **Output:**", "```js\n" + error + "```");
        }
        embed.addField(":label: Type:", "```ts\n" + parseType(error) + "```");
        embed.setFooter("React to delete message.");
        
        message.channel.send(embed).then(function(msg) {
            msg.react("778429346071052298");
            
            const filter = (reaction, user) => reaction.emoji.id === "778429346071052298" && user.id === message.author.id;
            
            msg.createReactionCollector(filter, { time: 30000, max: 1 }).on("collect", async collected => {
                if (collected.emoji.id === "778429346071052298") return msg.delete();
            });
        });
    }
 }
}
module.exports = Eval;


async function parseEval(input) {
    const isPromise = input instanceof Promise && typeof input.then === "function" && typeof input.catch === "function";
    
    if (isPromise) {
        input = await input;
        
        return {
            evaled: input,
            type: `Promise<${parseType(input)}>`
        }
    }
    return {
        evaled: input,
        type: parseType(input)
    }
}

function parseType(input) {
    if (input instanceof Buffer) {
        let length = Math.round(input.length / 1024 / 1024);
        let ic = "MB";
        
        if (!length) {
            length = Math.round(input.length / 1024);
            ic = "KB";
        }
        
        if (!length) {
            length = Math.round(input.length);
            ic = "Bytes";
        }
        return `Buffer (${length} ${ic})`;
    }
    return input === null || input === undefined ? "void" : input.constructor.name;
}

function parseQuery(queries) {
    const query = [];
    const flags = [];
    
    for (const args of queries) {
        if (args.startsWith("--")) {
            flags.push(args.slice(2).toLowerCase());
        } else {
            query.push(args);
        }
    }
    return { query, flags }
}