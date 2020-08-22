let objcodes = new Object;
require('fs').readFileSync('./src/assets/currencies.txt').toString().split('\n').forEach(line => {
    let prop = line.split(':');
    objcodes[prop[0].trim()] = prop[1].trim();
});
let codes = Object.getOwnPropertyNames(objcodes);
exports.description = `Converts currencies, calculates them, etc.\nSupported currencies: ${codes.join(', ')}`;
exports.usage = '[amount] <first currency> <wanted currency>\nEUR PLN\n10 EUR PLN';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    if (message.args.length < 2) throw ['args', 2];
    let {round} = require('../src/utils/formatter');
    let num = 1;
    message.args[0] = message.args[0].replace(/,/g, '.'); //handling float values like 19,5 by simple replacement to 19.5, so that node considers that as a valid number
    if (!isNaN(message.args[0])) num = message.args.shift();
    aliascodes = new Object; //adding few extra names, that are supported as defined currencies
    require('fs').readFileSync('./src/assets/currencyaliases.txt').toString().split('\n').forEach(line => {
        let prop = line.split(':');
        aliascodes[prop[0].trim()] = prop[1].trim();
    });
    function wanted(){
        if (codes.some(x => x == message.args[0].toUpperCase())) return message.args[0].toUpperCase();
        if (Object.getOwnPropertyNames(aliascodes).includes(message.args[0].toLowerCase())) return aliascodes[message.args[0].toLowerCase()];
        return false;
    }
    function base(){
        if (!message.args[1]) throw ['normal', 'Provide second currency as well!'];
        let secCurr; //handling old word 'to' in between currencies, alongside newly added '=' and '=='
        if (['to', '=', '=='].includes(message.args[1].toLowerCase())) secCurr = message.args[2];
        else secCurr = message.args[1];
        if (!secCurr) return false;
        if (codes.some(x => x == secCurr.toUpperCase())) return secCurr.toUpperCase();
        if (Object.getOwnPropertyNames(aliascodes).includes(secCurr.toLowerCase())) return aliascodes[secCurr.toLowerCase()];
        return false;
    }
    if (!base() || !wanted()) throw ['normal', `Unsupported currency or wrong currency format was provided!\nCheck \`${message.prefix}help ${this.name}\` for valid formats.`];
    let fetch = require('node-fetch');
    let apidata = await fetch(`https://api.exchangeratesapi.io/latest?base=${wanted()}`).then(d => d.json());
    let embed = {
        color: message.member ? message.member.displayColor : 0x23c482,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        description: `**${num}** ${objcodes[wanted()]} (${wanted()}) = **${round(num * apidata.rates[base()], 4)}** ${objcodes[base()]} (${base()})`
    }
    message.channel.send({embed:embed});
}