const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json');
const Pokedex = require('oakdex-pokedex');
const fs = require('fs');
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}. Ready to go!`);
});

fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    let modules = files.filter(f => f.split(".").pop() === "js");
    if (modules.length <= 0) {
        console.log("No public commands found. Running with no public commands loaded.");
        return;
    }

    console.log(`Now loading ${modules.length} public commands.`)
    modules.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        try {
            client.commands.set(props.help.name, props);
        } catch (err) {
            console.log('One or more of your public commands caused an error. Check your public commands and try again. \n=> ' + err);
            process.exit(1)
        }
    })

    console.log(`Finished loading all ${modules.length} commands.`)
})

client.on('message', async message => {
    let prefix = config.prefix;
    let array = message.content.split(" ")
    let command = array[0];
    let args = array.slice(1);
    if (!command.startsWith(prefix)) return;
    let cmd = client.commands.get(command.slice(prefix.length));
    if (cmd) {
        cmd.run(client, message, args);
    } else {
        message.channel.send(`Oh, \`${command.slice(prefix.length)}\` doesn't appear to be a valid command in my database. Try \`${prefix}help\` for a list of commands!`)
    }
});
client.login(process.env.TOKEN);