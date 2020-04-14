exports.description = 'Translates Discord snowflake (ID of everything - users, emotes, messages, channels, etc.) to the Date.';
exports.usage = '<snowflake>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    if (!/\d{17,}/.test(message.args[0])) throw ['normal', 'Invalid snowflake was provided, more info here: <https://discordapp.com/developers/docs/reference#snowflakes>'];
    let {snowflake, dateFormat, hourFormat, msToHuman} = require('../src/utils/formatter');
    let sf = snowflake(message.args[0]);
    message.channel.send({embed:{
        color: 0x2f3136,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        timestamp: message.createdAt,
        description: `Date (UTC): **${dateFormat(new Date(sf.timestamp))}, ${hourFormat(new Date(sf.timestamp))}** (${sf.timestamp}) \`${msToHuman(message.createdTimestamp - sf.timestamp)} ago\``
        +`\nWorker ID: ${sf.worker}`
        +`\nProcess ID: ${sf.process}`
        +`\nIncrement: ${sf.increment}`
    }});
}