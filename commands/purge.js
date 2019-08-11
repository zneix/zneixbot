exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Cleans specified amount of messages.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} (number of messages to delete, max 100)`
exports.perms = ['MANAGE_MESSAGES']

exports.run = async (client, message) => {
    message.command(1, async () => {
        if (isNaN(message.args[0]) || message.args[0] < 1) throw "This is not a valid positive number!"
        if (message.args[0] > 100) throw "Deleting more than **100** messages at once is impossible."
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) throw "I don't have **MANAGE_MESSAGES** persmission here!"
        message.delete();
        await message.channel.fetchMessages();
        await message.channel.bulkDelete(message.args[0])
        .catch(err => {return message.channel.send("Error while deleting messages:\n```"+err+"```")});
        message.channel.send(`Deleted **${message.args[0]}** message(s).`).then(msg => msg.delete(3500));
    });
}