module.exports = async (oldMessage, newMessage) => {
    //last condidition is for ignoring events emitted just because of embed update (often occurs when someone posts a YouTube link)
    if (newMessage.channel.type == 'dm' || newMessage.author.bot || !newMessage.editedTimestamp) return;
    await require('../src/utils/loader').getGuildConfig(newMessage.guild);
    require('../src/modules/logging.js').messageUpdate(oldMessage, newMessage);
}