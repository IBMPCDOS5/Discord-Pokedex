module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const Dexter = require('oakdex-pokedex');

    const config = require('../config.json');
    let embed;

    let moves;
    let type;
    let name;
    let sprite;
    let abilities;

    if (!args[0]) {
        embed = new Discord.RichEmbed()
            .setColor("BLUE")
            .setTitle('Error - No Information Given')
            .setDescription("There isn't enough information given to find a Pokémon based on your parameters.")
            .setFooter(`${config.name} v${config.version}`)
            .setTimestamp()
        message.channel.send({ embed });
    }

    try {
        Dexter.findPokemon(capitalizeFirstLetter(args[0]), function (p) {
            name = p.names.en;
            moves = p.learnset;
            type = p.types;
            abilities = p.abilities;
            
            message.channel.send(`Information for ${p.names.en}: \r\n\r\n Type(s): ${type}\r\nAbilities: ${JSON.stringify(abilities)}\r\nDescription: ${JSON.stringify(p.pokedex_entries.Y)}`);
        })
    } catch (e) {
        message.channel.send(e.stack);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
}
module.exports.help = {
    name: 'pkmn',
    args: 'The Pokémon to find.',
    notes: 'What good is a Pokédex without it actually searching?',
    category: 'Pokédex'
}