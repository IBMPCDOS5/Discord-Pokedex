module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const Dexter = require('oakdex-pokedex');

    const config = require('../config.json');
    let embed;

    const filter = m => m.filter == message.author;

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
        return;
    }

    try {
        Dexter.findPokemon(capitalizeFirstLetter(args[0]), function (p) {
            name = p.names.en;
            moves = p.learnset;
            type = p.types;
            abilities = p.abilities;
            let parsedAbilities;
            for (i in abilities) {
                let object = abilities[i];
                parsedAbilities = object.name;
            }
            embed = new Discord.RichEmbed()
                .setTitle(`Information for ${p.names.en}:`)
                .setDescription("Note: This information is only accurate up to Generation 6 (Pokémon X/Y).")
                .addField(`Type`, type)
                .addField(`Abilities`, parsedAbilities)
                .addField(`Height`, `Imperial: ${JSON.stringify(p.height_us)} ft. (${JSON.stringify(p.height_eu)})`)
                .addField(`Weight`, `${JSON.stringify(p.weight_us)} (${JSON.stringify(p.weight_eu)})`)
                .addField("Gender Ratio", `${JSON.stringify(p.gender_ratios.male)}% M / ${JSON.stringify(p.gender_ratios.female)}`)
                .addField('National ID', p.national.id)
                .setColor('BLUE')
                .setFooter(`${config.name} v${config.version}`)
                .setTimestamp()
            message.channel.send({ embed });
            message.channel.send(`Would you like to see the information in German? Reply with \`yes\` or \`no\`. (Möchten Sie die Informationen auf Deutsch sehen? Reagiere mit \`Ja\` oder \`Nein\`.)`);
            message.channel.awaitMessages(filter, {
                time: 15000,
                max: 1,
                errors: ['time']
            }).then(collected => {
                if (collected.first().content.toLowerCase() == "yes" || collected.first().content.toLowerCase() == "ja") {
                    embed = new Discord.RichEmbed()
                        .setTitle(`Information für ${p.names.de}:`)
                        .setDescription("Hinweis: Diese Information ist nur bis Gen 6 korrekt (Pokemon X / Y).")
                        .addField(`Art`, type)
                        .addField(`Fähigkeiten`, parsedAbilities)
                        .addField(`Höhe`, JSON.stringify(p.height_eu))
                        .addField(`Weight`, JSON.stringify(p.weight_eu))
                        .addField("Geschlechterverhältnis", `${JSON.stringify(p.gender_ratios.male)}% M / ${JSON.stringify(p.gender_ratios.female)}% F.`)
                        .addField('Dex-Nummer', p.national_id)
                        .setColor('BLUE')
                        .setFooter(`${config.name} v${config.version}`)
                        .setTimestamp()
                    message.channel.send({ embed });
                } else if (collected.first().content.toLowerCase() == "no" || collected.first().content.toLowerCase() == "nein") {
                    message.channel.send("Okay, I won't do that.");
                } else return;
            }).catch(() => {
                message.channel.send("No information was given within the alotted amount of time.");
            })
        })
    } catch (e) {
        embed = new Discord.RichEmbed()
            .setColor("BLUE")
            .setTitle("Information for... err... well...")
            .setDescription(`I couldn't find anything under the name of ${capitalizeFirstLetter(args[0])}. Maybe you misspelt something?`)
            .setFooter(`${config.name} v${config.version}`)
            .setTimestamp()
        message.channel.send({ embed });
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