exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Translates Discord snowflake (ID of everything - users, emotes, messages, channels, etc.) to the Date.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <snowflake>`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let time = require('../utils/timeFormatter');
        let sf = time.snowflake(message.args[0]);
        let embed = {
            color: 0x2f3136,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            timestamp: message.createdAt,
            description: `Date (UTC): **${time.dateFormat(new Date(sf.timestamp))}** (${sf.timestamp}) \`${time.msFormat(message.createdTimestamp-sf.timestamp)} ago\`\nWorker ID: ${sf.worker}\nProcess ID: ${sf.process}\nIncrement: ${sf.increment}`
        }
        message.channel.send({embed:embed});
    });
}