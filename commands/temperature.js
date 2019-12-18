let objcodes = {
    "c": "Celsius",
    "f": "Fahrenheit"
};
let codes = Object.getOwnPropertyNames(objcodes);
exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Converts Celcius to Farenheit and vice-versa.\nSupported temperatures: C, F`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 20 C\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 56 F`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let num = 1;
        message.args[0] = message.args[0].replace(/,/g, ".");
        if (!isNaN(message.args[0])) num = message.args.shift();
        function wanted(){
            if (codes.some(x => x === message.args[0].toLowerCase())) return message.args[0].toLowerCase();
            return false;
        }
        if (!wanted()) throw `Wrong temperature unit format!\nMust be either C or F`;
        let base = message.args[0].toLowerCase()==="c"?"f":"c";
        let embed = {
            color: message.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            description: `**${num} ${wanted().toUpperCase()}** = **${round((base==="c"?FtoC(num):CtoF(num)), 2)} ${base.toUpperCase()}**`
        }
        message.channel.send({embed:embed});
    });
}
function round(n, k){
    let factor = 10**k;
    return Math.round(n*factor)/factor;
}
function FtoC(num){
    return ((num-32)*5)/9;
}
function CtoF(num){
    return (num*1.8)+32;
}