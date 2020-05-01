module.exports = async (oldMember, newMember) => {
    await require('../src/utils/loader').getGuildConfig(newMember.guild);
    if (oldMember.nickname != newMember.nickname) require('../src/modules/logging').nicknameUpdate(oldMember, newMember);
}