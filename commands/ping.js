module.exports.run = async (client, message, args) => {
    message.channel.send("Pong! *I choose you!*");
}
module.exports.help = {
    name: 'ping',
    args: 'none',
    notes: 'Checks to see if the bot is online.',
    category: 'Basic'
}