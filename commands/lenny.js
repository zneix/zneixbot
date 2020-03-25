exports.description = 'Prints a lennyface';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.pipeable = false;

exports.run = async (client, message) => {
    message.channel.send('( ͡° ͜ʖ ͡°)');
}