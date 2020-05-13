exports.description = 'Cleans specified amount of messages. Must be between 1 and 100.';
exports.usage = '<1 - 100>';
exports.level = 0;
exports.perms = ['MANAGE_MESSAGES'];
exports.cooldown = 4500;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    let limit = 100; //maximum handled messages to delete (default is 100 due to API limitations, but we can do an iterate and delete lots of messages this way)
    if (Number.isInteger(message.args[0]) || message.args[0] < 1) throw ['normal', 'This is not a valid positive number!'];
    if (message.args[0] > limit) throw ['normal', `Deleting more than **${limit}** messages at once is not possible.`];
    if (message.channel.permissionsFor(client.user).missing(['MANAGE_MESSAGES']).length) throw ['botperm', 'Manage Messages'];

    //deleting command calling message first
    await message.delete();
    let toDelete = parseInt(message.args[0]);
    while (toDelete > 0){
        await message.channel.messages.fetch({limit: ((toDelete > 100) ? 100 : toDelete )});
        await message.channel.bulkDelete((toDelete > 100) ? 100 : toDelete).catch(err => {throw ['discordapi', err.toString()]})
        .then(coll => toDelete -= coll.size);
    }
    message.channel.send(`Deleted **${message.args[0]}** message(s).`).then(msg => msg.delete({timeout: 1500, reason: `Deleted ${message.args[0]} messages with purge command.`}));
}