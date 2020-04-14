exports.description = 'Rolls a random percentage between 0 and 100%.';
exports.usage = '[message]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    let random = Math.floor(Math.random() * 10001) / 100;
    message.channel.send(`${message.author.username}, chances for that are about **${random}%**`);
}