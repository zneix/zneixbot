module.exports = messages => {
    if (messages.first().channel.type == 'dm') return;
    require('../src/modules/logging').messageDeleteBulk(messages);
}