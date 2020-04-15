module.exports = async (guild, user) => {
    await require('../src/utils/loader').getGuildConfig(guild);
    require('../src/modules/logging').guildBanRemove(guild, user);
}