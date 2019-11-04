exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Picks random number between two numbers.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <first_number> <last_number>`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 1 100`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 21 37`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(2, async () => {
        let first = message.args[0].replace(/,/g, ".");
        let last = message.args[1].replace(/,/g, ".");
        let rng = Math.floor(first + Math.random()*(last-first+1));
        if (isNaN(message.args[0])) throw 'First number value is invalid!';
        if (isNaN(message.args[1])) throw 'Last number value is invalid!';
        message.channel.send(`Random number between **${first}-${last}**: __${rng}__`);
    });
}