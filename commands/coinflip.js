exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Flips a coin, heads or tails, true or false, yes or no.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        message.reply(Math.floor(Math.random()*2)?"heads (yes)":"tails (no)");
    });
}