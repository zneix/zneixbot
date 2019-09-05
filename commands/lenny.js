exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Prints a lennyface.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        message.channel.send('( ͡° ͜ʖ ͡°)');
        message.channel.send('here ya go, scrub').then(msg => msg.delete(3000));
    });
}