exports.description = 'Prints a lennyface.';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    message.channel.send('( ͡° ͜ʖ ͡°)');
}