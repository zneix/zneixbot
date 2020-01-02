exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Checks validation of IP addresses and resolves hostnames to IPv4 addresses.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <IP | hostname>`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let apidata;
        let domain;
        if (/^[a-z0-9][a-z0-9-_.]{2,}[a-z0-9]$/.test(message.args[0].toLowerCase())){
            let dns = require('dns');
            dns.lookup(message.args[0].toLowerCase(), async function(err, address, family){
                domain = message.args[0].toLowerCase();
                apidata = await apifetch(address);
            })
        }
        else apidata = await apifetch(message.args[0]);
        //functions
        async function apifetch(ip){
            let result = await client.fetch(`https://api.ipdata.co/${ip}?api-key=test`).then(data => data.json());
            let embed = {
                color: 0xfff12e,
                timestamp: new Date(),
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                fields: [
                    {
                        name: 'IP Address',
                        value: result.ip || 'IP address not found ;-;'
                    },
                    {
                        name: 'Country',
                        value: result.country_name+" "+result.emoji_flag || 'IP address not found ;-;'
                    }
                ]
            }
            message.channel.send({embed:embed});
        }
    });
}