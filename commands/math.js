exports.description = 'Calculates your math expression. See mathjs documentation for better understanding .';
exports.usage = '<math expression>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
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
    const mathjs = require('mathjs');
    let resp = '';
    try {
        resp = mathjs.evaluate(expression);
    }
    catch (err){
        resp = err.toString();
    }
    if (resp == Infinity) resp = resp.toString().replace(/^(-?)Infinity$/, `$1Infinity, either your input was too dank or calculation result is too high.`);
    message.channel.send(`\`${expression}\` = ${resp}`);
}