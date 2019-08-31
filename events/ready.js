module.exports = async client => {
    require('../utils/clientPresence')(client);
    client.logger.ready();
}