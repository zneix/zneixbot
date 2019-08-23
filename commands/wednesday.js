exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Checks if it's wednesday, my dude.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = async (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let emote = require('../utils/emoteHandler')(client);
        let time = new Date().getUTCDay();
        let Pepega;
        switch(time){
            // case 0: Pepega = 'it is Sunday my dude '+emote.find("BlessRNG");break;
            case 1: Pepega = 'two more days, my dude '+emote.find("OkayChamp");break;
            case 2: Pepega = 'Tommorow, my dude '+emote.find("PagChomp");break;
            case 3: Pepega = `**it is Wednesday, my dude ${emote.find("FeelsOkayMan")} ${emote.find("forsenPls")}**`;break;
            case 4: Pepega = 'I hate Thursdays '+emote.find("NotLikeThis");break;
            case 5: Pepega = emote.find("GachiPls")+' weekend, my dude';break;
            case 6: Pepega = 'it is Weekend my dude '+emote.find("EZ");break;
            case 7: Pepega = 'it is Weekend my dude '+emote.find("EZ");break;
        }
        if (!Pepega) Pepega = 'it is not Wednesday, my dude '+emote.find("FeelsBadMan"); //just in case something would go wrong
        message.reply(Pepega);
    });
}