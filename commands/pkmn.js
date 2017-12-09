module.exports.run = async (client, message, args) => {
    const pkmn = require('pkmn');
    const Discord = require('discord.js');
    const Dexter = new pkmn();

    const config = require('../config.json');
    let embed;
    if (!args[0]) {
        embed = new Discord.RichEmbed()
            .setColor("BLUE")
            .setTitle('Error - No Information Given')
            .setDescription("There isn't enough information given to find a Pokémon based on your parameters.")
            .setFooter(`${config.name} v${config.version}`)
            .setTimestamp()
        message.channel.send({ embed });
    }
    Dexter.get('pokemon', args[0].toLowerCase).then(pokemon => {
        message.channel.send(pokemon.pokemon);
    }).catch(err => {
        message.channel.send(`There appears to be an issue; either the Pokémon could not be found or there was an issue connecting to the API. Would you like to view the message? Reply with \`yes\` or \`no\`.`);
        let filter = m => m.author == message.author;
        message.channel.awaitMessages(filter, {
            time: 15000,
            max: 1,
            errors: ['time']
        }).then(collection => {
            if (collection.first().contents.toLowerCase() == "yes" || "y") {
                message.channel.send(`Here's the error information: \r\n\`\`\`${err.stack}\`\`\``);
            } else {
                return message.channel.send("Okay! I won't show you the information.");
            }
        }).catch(()=>{
            message.channel.send("There was no information that was given in the alotted amount of time.");
        })
    })
}
module.exports.help = {
    name: 'pkmn',
    args: 'The Pokémon to find.',
    notes: 'What good is a Pokédex without it actually searching?',
    category: 'Pokédex'
}