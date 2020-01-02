let objcodes = {
    "CAD": "Canadian Dollar 🇨🇦",
    "HKD": "Honkgong Dollar 🇭🇰",
    "ISK": "Icelandic Krona 🇮🇸",
    "PHP": "Philippine Peso 🇵🇭",
    "DKK": "Danish Krone 🇩🇰",
    "HUF": "Hungarian Forint 🇭🇺",
    "CZK": "Czech Koruna 🇨🇿",
    "GBP": "Pound Sterling 🇬🇧",
    "RON": "Romanian Leu 🇷🇴",
    "SEK": "Swedish Krona 🇸🇪",
    "IDR": "Indonesian Rupiah 🇮🇩",
    "INR": "Indian Rupee 🇮🇳",
    "BRL": "Brazilian Real 🇧🇷",
    "RUB": "Russian Ruble 🇷🇺",
    "HRK": "Croatian Kuna 🇭🇷",
    "JPY": "Japanese Yen 🇯🇵",
    "THB": "Thai Baht 🇹🇭",
    "CHF": "Swiss Franc 🇨🇭",
    "EUR": "Euro 🇪🇺",
    "MYR": "Malaysian Ringgit 🇲🇾",
    "BGN": "Bulgarian Lev 🇧🇬",
    "TRY": "Turkish Lira 🇹🇷",
    "CNY": "Chinese Yuan 🇨🇳",
    "NOK": "Norwegian Krone 🇳🇴",
    "NZD": "New Zealand Dollar 🇳🇿",
    "ZAR": "South African Rand 🇿🇦",
    "USD": "American Dollar 🇺🇸",
    "MXN": "Mexican Peso 🇲🇽",
    "SGD": "Singapore Dollar 🇸🇬",
    "AUD": "Australian Dollar 🇦🇺",
    "ILS": "Israeli New Shekel 🇮🇱",
    "KRW": "South Korean Won 🇰🇷",
    "PLN": "Polish Zloty 🇵🇱"
};
let codes = Object.getOwnPropertyNames(objcodes);
exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Converts currencies, calculates them, etc.\nSupported currencies: ${codes.join(', ')}`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [amount, deafult: 1] <first currency> <wanted currency>`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} EUR PLN\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 10 EUR PLN`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        let {round} = require('../utils/timeFormatter');
        let num = 1;
        message.args[0] = message.args[0].replace(/,/g, ".");
        if (!isNaN(message.args[0])) num = message.args.shift();
        function wanted(){
            if (codes.some(x => x === message.args[0].toUpperCase())) return message.args[0].toUpperCase();
            return false;
        }
        function base(){
            let secCurr; //handling old word 'to' in between currencies, alongside newly defined '=' and '=='
            if (message.args[1] == 'to' || message.args[1] == '=' || message.args[1] == '==') secCurr = message.args[2];
            else secCurr = message.args[1];
            if (!secCurr) return false;
            if (codes.some(x => x === secCurr.toUpperCase())) return secCurr.toUpperCase();
            return false;
        }
        if (!base() || !wanted()) throw `Unsupported currency or wrong currency format was provided!\nCheck \`${message.guild.prefix}help ${__filename.split(/[\\/]/).pop().slice(0,-3)}\` for more information.`;
        let apidata = await client.fetch(`https://api.exchangeratesapi.io/latest?base=${wanted()}`).then(data => data.json());
        let embed = {
            color: message.member.displayColor,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            description: `**${num}** ${objcodes[wanted()]} (${wanted()}) = **${round(num * apidata.rates[base()], 4)}** ${objcodes[base()]} (${base()})`
        }
        message.channel.send({embed:embed});
    });
}