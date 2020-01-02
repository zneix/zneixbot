exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Picks random integer between two provided numbers. I.e. 1 10 picks a random number between 1 and 10 (inclusive).';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <first number> <last number>`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 1 100`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 21 37`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(2, async () => {
        let first = message.args[0].replace(/,/g, ".");
        let last = message.args[1].replace(/,/g, ".");
        if (isNaN(message.args[0])) throw 'First number value is invalid!';
        if (isNaN(message.args[1])) throw 'Last number value is invalid!';
        let random = Math.floor((parseInt(first)) + (Math.random()*(last-first+1)));
        message.channel.send(`Random number between **${first}-${last}**: __${first==last?first:random}__`);
    });
}