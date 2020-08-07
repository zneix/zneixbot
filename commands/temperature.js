exports.description = 'Converts Celcius to Farenheit and vice-versa.\nSupported temperatures: C, F';
exports.usage = `[amount of degrees] <C | F>\n56 F\n20 C`;
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    let objcodes = {
        "c": "Celsius",
        "f": "Fahrenheit"
    }
    let codes = Object.keys(objcodes);
    let {round} = require('../src/utils/formatter');
    let num = 1;
    message.args[0] = message.args[0].replace(/,/g, '.');
    if (!isNaN(message.args[0])){
        num = message.args.shift();
        //checking if there are any other arguments remaining, if not - return an error
        if (!message.args.length) throw ['normal', 'Temperature must be either C or F'];
    }
    function wanted(){
        if (codes.some(x => x == message.args[0].toLowerCase())) return message.args[0].toLowerCase();
        return false;
    }
    if (!wanted()) throw ['normal', 'Temperature must be either C or F'];
    let base = message.args[0].toLowerCase() == 'c' ? 'f' : 'c';
    message.channel.send({embed:{
        color: message.member ? message.member.displayColor : 0x23c482,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        description: `**${num} ${wanted().toUpperCase()}** = **${round((base == 'c' ? FtoC(num) : CtoF(num)), 2)} ${base.toUpperCase()}**`
    }});
}
function FtoC(num){ return ((num - 32) * 5) / 9; }
function CtoF(num){ return (num * 1.8) + 32; }