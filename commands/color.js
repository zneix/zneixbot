exports.description = "Prints informations about given color. When no arguments are provided, generates a random color.\nSupports HEX, RGB, Numeric value";
exports.usage = '<color>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) return resolve(null, 'random');
    let error = `This is not a valid color format!\nUse **${message.prefix}help ${__filename.split(/[\\/]/).pop().slice(0,-3)}** for valid formats.`
    //resolving numeric value
    if (!isNaN(message.args[0]) && message.args[0] < 16777216 && message.args[0] >= 0) return resolve(message.args[0], 'number');
    //resolving hex value (and triple-hex below as well)
    if (/^[^a-f0-9]*[a-f0-9]{6}$/i.test(message.args[0])) return resolve(/[a-f0-9]{6}$/i.exec(message.args[0])[0], 'hex');
    if (/^[^a-f0-9]*[a-f0-9]{3}$/i.test(message.args[0])) return resolve(/[a-f0-9]{3}$/i.exec(message.args[0])[0], 'triphex');
    //trying to resolve rgb value
    if (/^\D*(\d{1,3})[\s\W]+(\d{1,3})[\s\W]+(\d{1,3})\D*$/.test(message.args.join(' '))){
        let rgbData = /^\D*(\d{1,3})[\s\W]+(\d{1,3})[\s\W]+(\d{1,3})\D*$/.exec(message.args.join(' ')).slice(1);
        rgbData.forEach(e => {if (e > 255) throw ['normal', error]});
        return resolve(rgbData, 'rgb');
    }
    if (message.args[0] == 'random') return resolve(null, 'random');
    throw ['normal', error];

    async function resolve(value, inputType){
        const fetch = require('node-fetch');
        let color = {};
        switch(inputType){
            case "triphex":
                value = value.split('').map(a => a+a).join(''); //simple hardfix
            case "hex":
                color.hex = value;
                color.rgb = `rgb(${value.match(/../g).map(e => parseInt(e, 16)).join(', ')})`;
                color.number = parseInt('0x'+value);
                break;
            case "rgb":
                color.hex = value.map(val => parseInt(val).toString(16).padStart(2, '0')).join('');
                color.rgb = `rgb(${value.join(', ')})`;
                color.number = parseInt(color.hex, 16);
                break;
            case "random":
                color.random = Math.floor(Math.random()*16777214);
                value = color.random;
            case "number":
                let hex = parseInt(value).toString(16);
                color.hex = hex.padStart(6, '0');
                color.rgb = `rgb(${hex.match(/../g).map(e => parseInt(e, 16)).join(', ')})`;
                color.number = parseInt(value);
                break;
        }
        let colorapi = await fetch(`https://www.thecolorapi.com/id?hex=${color.hex}`).then(res => res.json());
        let embed = {
            color: color.number >= 16777215 ? color.number-1 : color.number,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            author: {
                name: `Information about ${color.random ? 'random color' : (inputType == 'rgb' ? message.args.join(' ') : message.args[0])}`
            },
            thumbnail: {
                url: 'attachment://color.png'
            },
            description:
                `Hex: **#${color.hex}**\n`+
                `RGB: **${color.rgb}**\n`+
                `Numeric value: **${color.number}**\n`+
                `CSS Name: **${colorapi.name.value}**`
        };
        const {createCanvas} = require('canvas');
        let canvas = createCanvas(60, 60);
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = `#${color.hex}`;
        ctx.fillRect(0, 0, 60, 60);
        message.channel.send({embed: embed, files: [
            {
                name: 'color.png',
                attachment: canvas.toBuffer()
            }
        ]});
    }
}
