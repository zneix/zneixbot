module.exports = async () => {
    require('../src/utils/presence');
    await client.db.utils.insert('logready', [{
        readyAt: client.readyAt,
        readyTimestamp: client.readyTimestamp,
        size: {
            guilds: client.guilds.cache.size,
            users: client.users.cache.size
        }
    }]);
    require('../src/utils/logger').ready();
    await client.agenda.start(); //start the agenda once client is ready
    console.log('[agenda] Started job processing!');
}