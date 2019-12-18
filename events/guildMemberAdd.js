module.exports = async (client, member) => {
    require('../utils/loggingHandler').guildMemberAdd(client, member);
    require('../utils/clientPresence')(client);
}