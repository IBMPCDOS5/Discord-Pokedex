module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js');
    const Dexter = require('oakdex-pokedex');

    const config = require('../config.json');
    let embed;

    const filter = m => m.author.id == message.author.id;

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
                .addField(`Height`, `${p.height_us} ft. (${p.height_eu})`)
                .addField(`Weight`, `${p.weight_us} (${p.weight_eu})`)
                .addField("Gender Ratio", `${JSON.stringify(p.gender_ratios.male)}% M / ${JSON.stringify(p.gender_ratios.female)}% F.`)
                .addField('National ID', p.national_id)
                .setColor('BLUE')
                .setFooter(`${config.name} v${config.version}`)
                .setTimestamp()
            message.channel.send({ embed });
            message.channel.send(`Would you like to see the information in German? Reply with \`yes\` or \`no\`. (Möchten Sie die Informationen auf Deutsch sehen? Antworte mit \`Ja\` oder \`Nein\`.)`);
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 15000,

                errors: ['time']
            }).then(collected => {
                if (collected.first().content === "yes".toLowerCase() || collected.first().content === "ja".toLowerCase()) return showInGerman(p, message);
                if (collected.first().content === "no".toLowerCase()) return message.channel.send("Okay, I won't show in German.");
                if (collected.first().content === "nein".toLowerCase()) return message.channel.send("Okay, ich werde keine Informationen auf Deutsch zeigen.");
                
            }).catch(err => {
                console.log(err);
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
function showInGerman(p, message) {
    embed = new Discord.RichEmbed()
        .setTitle(`Information für ${p.names.de}:`)
        .setDescription("Hinweis: Diese Information ist nur bis Gen 6 korrekt (Pokemon X / Y).")
        .addField(`Art`, type)
        .addField(`Fähigkeiten`, parsedAbilities)
        .addField(`Höhe`, p.height_eu)
        .addField(`Weight`, p.weight_eu)
        .addField("Geschlechterverhältnis", `${p.gender_ratios.male}% M / ${JSON.stringify(p.gender_ratios.female)}% F.`)
        .addField('Dex-Nummer', p.national_id)
        .setColor('BLUE')
        .setFooter(`${config.name} v${config.version}`)
        .setTimestamp()
    message.channel.send({ embed });
}
}
module.exports.help = {
    name: 'pkmn',
    args: 'The Pokémon to find.',
    notes: 'What good is a Pokédex without it actually searching?',
    category: 'Pokédex'
}
