module.exports = async client => {
    require('../utils/clientPresence')(client);
    await client.db.db().collection('logready').insertOne({
        readyAt: client.readyAt,
        readyTimestamp: client.readyTimestamp,
        size: {
            guilds: client.guilds.size,
            users: client.users.size
        }
    });
    client.logger.ready();
    await client.agenda.start();
    console.log('[agenda] Started job processing!');
}