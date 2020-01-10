exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Cleans specified amount of messages.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <number of messages to delete, max 100>`;
exports.perms = [false, false, 'MANAGE_MESSAGES'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let limit = 100; //maximum handled messages to delete (default is 100 due to API limitations)
        if (isNaN(message.args[0]) || message.args[0] < 1) return {code: '15', msg: "This is not a valid positive number!"};
        if (message.args[0] > limit) return {code: '15', msg: `Deleting more than **${limit}** messages at once is not possible.`};
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return {code: '23', msg: 'Manage Messages'};
        //beginning of deletion process
        message.delete();
        await message.channel.fetchMessages();
        let isError = await message.channel.bulkDelete(message.args[0]).catch(err => {console.log(err);return {code: '27', msg: `${err}`}});
        if (isError.code == '27') return isError;
        message.channel.send(`Deleted **${message.args[0]}** message(s).`).then(msg => msg.delete(3500));
    });
}