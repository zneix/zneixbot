module.exports = async messages => {
    if (messages.first().channel.type == 'dm') return;
    await require('../src/utils/loader').getGuildConfig(messages.first().guild);
    require('../src/modules/logging').messageDeleteBulk(messages);
}