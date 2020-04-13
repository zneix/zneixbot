module.exports = (guild, user) => {
    require('../src/modules/logging').guildBanAdd(guild, user);
}