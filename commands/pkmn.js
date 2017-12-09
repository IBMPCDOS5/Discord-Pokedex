module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const Dexter = require('oakdex-pokedex');

    const config = require('../config.json');
    let embed;

    let moves;
    let type;
    let name;
    let sprite;

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
            moves = p.moves.en;
            type = p.types.en;
            embed = new Discord.RichEmbed()
                .setColor("BLUE")
                .setTitle(`Information for ${name}`)
                .addField("Type", type)
                .addField("Moves", moves)
                .setFooter(config.name + " v" + config.version)
            message.channel.send({ embed });
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