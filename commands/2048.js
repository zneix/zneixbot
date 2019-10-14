exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Creates a game of 2048 in embed.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        const RC = require('reaction-core');
        let game = require('../src/embeds/2048game')(client, message);
        let mergeGame = new RC.Menu(game.embed, game.buttons);
        client.RCHandler.addMenus(mergeGame);
        message.channel.sendMenu(mergeGame);
    });
}