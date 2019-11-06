module.exports = async client => {
    require('../utils/clientPresence')(client);
    await client.db.db().collection('readylogs').insertOne({readyAt: client.readyAt, readyTimestamp: client.readyTimestamp});
    client.logger.ready();
}