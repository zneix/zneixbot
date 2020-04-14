exports.description = 'Calculates your math expression. This command is rather poor, see mathjs documentation for better understanding.';
exports.usage = '<math expression>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    const fetch = require('node-fetch');
    let edgeCases = {
        'π': 'pi',
        '¹': '^1',
        '²': '^2',
        '³': '^3',
        '¼': '.25',
        '½': '.5',
        '¾': '.75'
    }
    let expression = message.args.join(' ');
    Object.keys(edgeCases).forEach(edge => expression = expression.replace(RegExp(edge, 'g'), edgeCases[edge]));
    let resp = await fetch(`https://api.ivr.fi/math?expr=${expression.split('').map(c => `%${c.charCodeAt(0).toString(16)}`).join('')}`, {
        method: 'GET',
        headers: { 'User-Agent': 'zneixbot project: https://github.com/zneix/zneixbot' }
    }).then(r => r.json());
    message.channel.send(`\`${expression}\` = ${resp.response}`);
}
