exports.description = 'Checks if it\'s wednesday, my dude (checks by UTC).';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    let time = message.createdAt.getUTCDay();
    let Pepega;
    switch(time){
        case 1: Pepega = `Two more days, my dude ${client.emoteHandler.find('OkayChamp')}`;break;
        case 2: Pepega = `Tommorow, my dude ${client.emoteHandler.find('PagChomp')}`;break;
        case 3:
            let videos = require('fs').readFileSync('./src/assets/wednesdayvideos.txt').toString().split('\n');
            let randomVideo = videos[Math.floor(Math.random() * videos.length)];
            Pepega = `**It is Wednesday, my dude ${client.emoteHandler.find('Wednesday')} ${client.emoteHandler.find('forsenPls')}**\nHere's a random wednesday video: <${randomVideo}>`;
            break;
        case 4: Pepega = `I hate Thursdays ${client.emoteHandler.find('NotLikeThis')}`;break;
        case 5: Pepega = `${client.emoteHandler.find('GachiPls')} weekend, my dude`;break;
        case 6:
        case 0: Pepega = `It is Weekend my dude ${client.emoteHandler.find('EZ')}`;break;
    }
    if (!Pepega) Pepega = `It is not Wednesday, my dude ${client.emoteHandler.find('FeelsBadMan')}`; //just in case something would go wrong
    message.reply(Pepega);
}