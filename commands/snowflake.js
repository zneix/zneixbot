exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Translates Discord snowflake (ID of everything - users, emotes, messages, channels, etc.) to the Date.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <snowflake>`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let time = require('../utils/timeFormatter');
        const DiscordEpoch = 1420070400000;
        function getBinSlice(start, end){return parseInt(parseInt(message.args[0]).toString(2).slice(start, end), 2);}
        let timestampSf = DiscordEpoch+getBinSlice(0, -22);
        let workerSf = getBinSlice(-22, -17);
        let processSf = getBinSlice(-17, -12);
        let incrementSf = getBinSlice(-12);
        let embed = {
            color: 0x2f3136,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            timestamp: message.createdAt,
            description: `Date (UTC): **${time.dateFormat(new Date(timestampSf))}** (${timestampSf}) \`${time.msFormat(message.createdTimestamp-timestampSf)} ago\`\nWorker ID: ${workerSf}\nProcess ID: ${processSf}\nIncrement: ${incrementSf}`
        }
        message.channel.send({embed:embed});
    });
}