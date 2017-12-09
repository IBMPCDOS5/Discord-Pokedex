module.exports.run = async (client, message, args) => {
    const Dexter = require('oakdex-pokedex');
    const Discord = require('discord.js');

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
    Dexter.findPokemon(args[0], function (p, err) {
        if (err) return message.channel.send(`There was an issue finding your specified Pokémon. Remember: names are case senstive!`);
        message.channel.send(`Testing the thing. Here's the name: ${p.names.en}.`)
    })
}
module.exports.help = {
    name: 'pkmn',
    args: 'The Pokémon to find.',
    notes: 'What good is a Pokédex without it actually searching?',
    category: 'Pokédex'
}