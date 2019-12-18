exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Rolls a random percentage between 0 and 100%.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} (optional message)`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let random = Math.floor(Math.random()*10001)/100;
        let wish = message.args.length?message.args.join(' '):'that';
        function clean(string){
            let filters = ['@everyone', '@here', 'xd'];
            filters.forEach(f => string = string.replace(f, `\`${f}\``));
            string = string.replace(/@/, '');
            return string.length?string:that;
        }
        message.reply(`chances for ${clean(wish)} are about **${random}%**`);
    });
}