module.exports = (oldMessage, newMessage) => {
    //last condidition is for ignoring events emitted just because of embed update (often occurs when someone posts a YouTube link)
    if (newMessage.channel.type == 'dm' || newMessage.author.bot || !newMessage.editedTimestamp) return;
    require('../src/modules/logging.js').messageUpdate(oldMessage, newMessage);
}