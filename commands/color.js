exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Prints informations about given color (or a random one).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} random`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} #00ff00`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} rgb(0, 255, 0)`
+`\n{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} 65280`
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        if (!message.args.length) return kolorek(null, "random");
        let error = `This is not a valid color format!\nUse **${message.guild.prefix}help ${__filename.split(/[\\/]/).pop().slice(0,-3)}** for valid formats.`
        if (/^\D*[a-f0-9]{6}$/i.test(message.args[0])) return kolorek(/[a-f0-9]{6}$/i.exec(message.args[0])[0], "hex");
        if (/^\D*(\d{1,3})[\s\W]+(\d{1,3})[\s\W]+(\d{1,3})\D*$/.test(message.args.join(' '))){
            let rgbData = /^\D*(\d{1,3})[\s\W]+(\d{1,3})[\s\W]+(\d{1,3})\D*$/.exec(message.args.join(' ')).slice(1);
            if (rgbData[0] > 255 || rgbData[1] > 255 || rgbData[2] > 255) throw error;
            return kolorek(rgbData, "rgb");
        }
        if (!isNaN(message.args[0]) && message.args[0] < 16777216 && message.args[0] >= 0) return kolorek(message.args[0], "number");
        if (message.args[0] === 'random') return kolorek(null, "random");
        throw error;

        //exec part
        async function kolorek(value, inputType){
            let {leadSigleHex, leadHex} = require('../utils/timeFormatter');
            let color = {};
            switch(inputType){
                case "hex":
                    color.hex = value;
                    color.rgb = `rgb(${'0x'+value[0]+value[1] | 0}, ${'0x' + value[2] + value[3] | 0}, ${'0x' + value[4] + value[5] | 0})`;
                    color.number = parseInt('0x'+value);
                    break;
                case "rgb":
                    let hexa = leadSigleHex(parseInt(value[0]).toString(16))+leadSigleHex(parseInt(value[1]).toString(16))+leadSigleHex(parseInt(value[2]).toString(16));
                    color.hex = hexa;
                    color.rgb = `rgb(${value.join(', ')})`;
                    color.number = parseInt('0x'+hexa);
                    break;
                case "random":
                    color.random = (Math.floor(Math.random()*16777215));
                    value = color.random;
                case "number":
                    let hex = parseInt(value).toString(16);
                    color.hex = leadHex(hex);
                    color.rgb = `rgb(${'0x'+hex[0]+hex[1] | 0}, ${'0x' + hex[2] + hex[3] | 0}, ${'0x' + hex[4] + hex[5] | 0})`;
                    color.number = parseInt(value);
                    break;
            }
            let colorapi = await client.fetch('https://www.thecolorapi.com/id?hex='+color.hex).then(res => res.json())
            let embed = {
                color: color.number,
                timestamp: Date.now(),
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                author: {
                    name: "Information about "+(color.random?"random color":(inputType==="rgb"?message.args.join(' '):message.args[0]))
                },
                thumbnail: {
                    url: `http://singlecolorimage.com/get/${color.hex}/60x60`
                },
                description:
                    "Hex: **#"+color.hex+"**\n"+
                    "RGB: **"+color.rgb+"**\n"+
                    "Numeric value: **"+color.number+"**\n"+
                    "CSS Name: **"+colorapi.name.value+"**"
            };
            message.channel.send({embed:embed});
        }
    });
}