module.exports = async () => {
    require('../src/utils/presence')();
    await client.db.utils.insert('logready', [{
        readyAt: client.readyAt,
        readyTimestamp: client.readyTimestamp,
        size: {
            guilds: client.guilds.cache.size,
            users: client.users.cache.size
        }
    }]);
    client.logger.ready();
    //start the non-agenda once client is ready
    client.cron.load().then(count => console.log(`[cron] Scheduled ${count} job(s) at startup`));
}