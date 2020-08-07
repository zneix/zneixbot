exports.description = 'Attempts to resolve hostnames to IPv4 addresses and checks their location. IPv6 isn\'t supported yet.';
exports.usage = `<IP | hostname>`;
exports.level = 0;
exports.perms = [];
exports.cooldown = 7500;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    const dns = require('dns');
    dns.lookup(message.args[0].toLowerCase(), async function(err, address, family){
        //exec part
        const fetch = require('node-fetch');
        const apikey = require('../src/json/auth').apis.ip;
        let result = await fetch(`https://api.ipdata.co/${address}?api-key=${apikey}`).then(data => data.json());
        let embed = {
            color: 0xfff12e,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            fields: [
                {
                    name: 'IP Address',
                    value: result.ip || 'IP address not found ;-;'
                },
                {
                    name: 'Country',
                    value: `${result.country_name} ${result.emoji_flag}` || 'IP address not found ;-;'
                }
            ]
        }
        message.channel.send({embed:embed});
    });
}
