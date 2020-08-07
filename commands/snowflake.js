exports.description = 'Translates Discord snowflake (ID of everything - users, emotes, messages, channels, etc.) to the Date.';
exports.usage = '<snowflake>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    //parsing channel/user mentions
    let argSf = /\d{17,}/.exec(message.args[0]);
    if (!argSf) throw ['normal', 'Invalid snowflake was provided, more info here: <https://discordapp.com/developers/docs/reference#snowflakes>'];
    let {snowflake, dateFormat, hourFormat, msToHuman} = require('../src/utils/formatter');
    let sf = snowflake(argSf[0]);
    message.channel.send({embed:{
        color: 0x2f3136,
        footer: {
            text: `${message.author.tag} | ${argSf[0]}`,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        timestamp: message.createdAt,
        description: `Date (UTC): **${dateFormat(new Date(sf.timestamp))}, ${hourFormat(new Date(sf.timestamp))}** (${sf.timestamp}) \`${msToHuman(message.createdTimestamp - sf.timestamp, 4)} ago\``
        +`\nWorker ID: ${sf.worker}`
        +`\nProcess ID: ${sf.process}`
        +`\nIncrement: ${sf.increment}`
    }});
}