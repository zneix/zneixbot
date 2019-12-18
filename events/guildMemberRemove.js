module.exports = async (client, member) => {
    require('../utils/loggingHandler').guildMemberRemove(client, member);
    require('../utils/clientPresence')(client);
}