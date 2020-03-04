exports.description = 'Rolls a random percentage between 0 and 100%.';
exports.usage = '[message]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.pipeable = false;

exports.run = async (client, message) => {
    let random = Math.floor(Math.random()*10001)/100;
    let wish = message.args.length ? message.args.join(' ') : 'that';
    function clean(string){
        // let filters = ['@everyone', '@here'];
        let todelete = ['nigger'];
        // filters.forEach(f => string = string.replace(f, `\`${f}\``));
        todelete.forEach(f => string = string.replace(f, ''));
        string = string.replace(/@(everyone|here)/, '@\u200b$1')
        .replace(/<@!?(\d+)>/gm, (regex, id) => `@\u200b${message.guild.member(id).nickname || message.guild.member(id).user.username}`)
        .replace(/<@&(\d+)>/, (regex, id) => `\u200b_${message.guild.roles.cache.get(id).name}`); //finish this later
        return string.length ? string : 'that';
    }
    message.channel.send(`${message.author.username}, chances for ${wish} are about **${random}%**`);
}