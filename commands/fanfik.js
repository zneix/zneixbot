exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Links Witt#1338's epicc fanfic.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let origin = `https://www.wattpad.com/623549440-jak-naprawd%C4%99-powsta%C5%82-%C5%9Bwiat-1-jak-zosta%C5%82em-bogiem`;
        let second = `https://www.wattpad.com/710733117-przygody-wita-stwórcy-sezon-2-0-zanim-zaczniesz`;
        let special = `https://www.wattpad.com/674077106-przygody-wita-stw%C3%B3rcy-christmas-special-wigilia-u`;
        var embed = {
            color: 0xceffff,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            author: {
                name: `Epicc Witt's fanfics:`,
                icon_url: client.users.get("226646760515305473").avatarURL //Witt's avatar
            },
            fields: [
                {
                    name: `Part 1st`,
                    value: origin
                },
                {
                    name: `Part 2nd`,
                    value: second
                },
                {
                    name: `Christmas Special`,
                    value: special
                }
            ]
        }
        message.channel.send({embed:embed});
    });
}