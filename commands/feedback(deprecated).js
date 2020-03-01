exports.description = 'Send your feedback directly to bot developer, supports file attachments.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <your message> [file attachments]`;
exports.perms = [false, false];
// exports.cooldown = new Set(); //FINISH COOLDOWN THINGY

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let embed = {
            color: 0x79fcb2,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            author: {
                name: `New feedback report`,
                url: message.url
            },
            fields: [
                {
                    name: 'Sender',
                    value: `${message.author} **${message.author.tag}** \`${message.author.id}\``
                },
                {
                    name: 'Location',
                    value: `Channel: ${message.channel} **${message.channel.name}** \`${message.channel.id}\`\nServer: **${message.guild.name}** \`${message.guild.id}\``
                },
                {
                    name: 'Message',
                    value: `${message.content.slice(message.guild.prefix.length).split(/\s+/g).slice(1).join(" ").substr(0, 1015)} [link](${message.url})`
                }
            ]
        }
        if (message.attachments.size){
            let filelinks = [];
            message.attachments.forEach((object, key, map) => filelinks.push(`[${object.filename}](${object.url})`));
            embed.fields.push({
                name: 'File Attachments',
                value: filelinks.join("\n").length<1023?filelinks.join("\n"):(filelinks.join("\n").substr(0, 1011)+" [truncated]")
            });
        }
        let feedback = client.channels.get(client.config.channels.feedback);
        if (!feedback){
            console.log("(!feedback) Feedback channel wasn't found!");
            return {code: '26', msg: "Bot developer hasn't set a feedback channel yet"};
        }
        return feedback.send({embed:embed})
        .then(() => {
            message.react('👌');
            message.channel.send("Thanks for feedback! Devs will take a look it.\nIn the meantime, you can check out my GitHub repository ~~and give a star~~ <https://github.com/zneix/zneixbot>");
        })
        .catch(err => {return {code: '27', msg: err.toString()}});
    });
}