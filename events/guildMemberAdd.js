module.exports = async member => {
    await require('../src/utils/loader').getGuildConfig(member.guild);
    require('../src/modules/logging').guildMemberAdd(member);
}