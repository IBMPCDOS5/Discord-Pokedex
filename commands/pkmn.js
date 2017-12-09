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
            max: 1,
            time: 15000,
            errors: ['time']
        }).then(collected => {
            switch (collected.first().content.toLowerCase()) {
                default:
                    message.channel.send("Invalid option. Cancelling action.")
                    break;
                case "yes":
                    message.channel.send(`Here's the error details: \r\n\`\`\`${err.stack}\`\`\``);
                    break;
                case "no":
                    message.channel.send("Okay! I won't do it.");
                    break;
                case "n":
                    message.channel.send("Okay! I won't do it.");
                    break;
                case "y":
                    message.channel.send(`Here's the error details: \r\n\`\`\`${err.stack}\`\`\``);
                    break;
            }
        }).catch(() => {
            message.channel.send("No reason was specified. Cancelling action.");
        })
    })
}
module.exports.help = {
    name: 'pkmn',
    args: 'The Pokémon to find.',
    notes: 'What good is a Pokédex without it actually searching?',
    category: 'Pokédex'
}