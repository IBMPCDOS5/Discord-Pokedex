module.exports.run = async (client, message, args) => {
    const edit = await message.channel.send("Pinging...");
    return edit.edit(`Pong!\r\n\r\nClient Latency: ${Math.round(client.ping)} ms.\r\n\r\nAPI Latency: ${Math.round(edit.createdTimestamp - message.createdTimestamp)} ms.`);
}
module.exports.help = {
    name: 'pingtime',
    args: 'none',
    notes: 'Shows the ping time of the client.',
    category: 'Basic'
}