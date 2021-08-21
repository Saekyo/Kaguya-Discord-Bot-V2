module.exports = {
    doc         : "Documentation",
    notFound    : "The command you are looking for was not found, maybe you should check the list of all available commands",
    pTitle      : ( cName ) => `\` ${ cName[0].toUpperCase() }${ cName.slice(1) } \` Informations`,
    pSName      : "Syntax",
    pSValue     : ( prefix, cUsage ) => `\`\`\`${ prefix }${ cUsage }\`\`\`\`[]\` = Required arguments, — \`{}\` = Optional arguments.`,
    pEName      : "Example",
    pEValue     : ( prefix, cName, cExample ) => `\`\`\`${ cExample && cExample.map( ( ex ) => `${prefix}${cName} ${ex}` ).join( "\n" ) || "No example provided" }\`\`\`\n`,
    firstTitle  : " — Kaguya",
    firstDesc   : "Kaguya is an adorable open source discord bot fully customizable created in javascript, using Discord.js and mongoDB that is constantly growing!\n\nYou can display the different commands by categories via the buttons below.",
    list        : "Commands",
    footer      : ( prefix ) => `You can type ${ prefix }help with the name of command for details`
};