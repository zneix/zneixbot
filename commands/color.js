exports.description = "Prints informations about given color. When no arguments are provided, generates a random color.\nSupports HEX, RGB, Numeric value";
exports.usage = '<color>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.pipeable = false;


exports.run = async (client, message) => {
    if (!message.args.length) return resolve(null, 'random');
    let error = `This is not a valid color format!\nUse **${message.prefix}help ${__filename.split(/[\\/]/).pop().slice(0,-3)}** for valid formats.`
    //resolving numeric value
    if (!isNaN(message.args[0]) && message.args[0] < 16777216 && message.args[0] >= 0) return resolve(message.args[0], 'number');
    //resolving hex value
    if (/^[^a-f0-9]*[a-f0-9]{6}$/i.test(message.args[0])) return resolve(/[a-f0-9]{6}$/i.exec(message.args[0])[0], 'hex');
    //trying to resolve rgb value
    if (/^\D*(\d{1,3})[\s\W]+(\d{1,3})[\s\W]+(\d{1,3})\D*$/.test(message.args.join(' '))){
        let rgbData = /^\D*(\d{1,3})[\s\W]+(\d{1,3})[\s\W]+(\d{1,3})\D*$/.exec(message.args.join(' ')).slice(1);
        rgbData.forEach(e => {if (e > 255) throw ['normal', error]});
        return resolve(rgbData, 'rgb');
    }
    if (message.args[0] === 'random') return resolve(null, 'random');
    throw ['normal', error];

    async function resolve(value, inputType){
        const {leadTwoHex, leadHex} = require('../src/utils/formatter');
        const fetch = require('node-fetch');
        let color = {};
        switch(inputType){
            case "hex":
                color.hex = value;
                color.rgb = `rgb(${value.match(/../g).map(e => parseInt(e, 16)).join(', ')})`;
                color.number = parseInt('0x'+value);
                break;
            case "rgb":
                color.hex = value.map(val => leadTwoHex(parseInt(val).toString(16))).join('');
                color.rgb = `rgb(${value.join(', ')})`;
                color.number = parseInt(hex, 16);
                break;
            case "random":
                color.random = Math.floor(Math.random()*16777214);
                value = color.random;
            case "number":
                let hex = parseInt(value).toString(16);
                color.hex = leadHex(hex);
                color.rgb = `rgb(${hex.match(/../g).map(e => parseInt(e, 16)).join(', ')})`;
                color.number = parseInt(value);
                break;
        }
        let colorapi = await fetch('https://www.thecolorapi.com/id?hex='+color.hex).then(res => res.json());
        let embed = {
            color: color.number >= 16777215 ? color.number-1 : color.number,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
            },
            author: {
                name: `Information about ${color.random ? 'random color' : (inputType == 'rgb' ? message.args.join(' ') : message.args[0])}`
            },
            thumbnail: {
                url: `http://singlecolorimage.com/get/${color.hex}/60x60`
            },
            description:
                `Hex: **#${color.hex}**\n`+
                `RGB: **${color.rgb}**\n`+
                `Numeric value: **${color.number}**\n`+
                `CSS Name: **${colorapi.name.value}**`
        };
        message.channel.send({embed:embed});
    }
}