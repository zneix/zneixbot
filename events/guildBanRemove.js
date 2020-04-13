module.exports = (guild, user) => {
    require('../src/modules/logging').guildBanRemove(guild, user);
}