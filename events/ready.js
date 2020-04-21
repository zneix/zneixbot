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
    //start the crons and scheduled jobs once client is ready
    client.cron.startCrons();
    console.log('[cron] Loaded all crons!');
    client.cron.loadScheduledJobs().then(count => console.log(`[cron] Scheduled ${count} job(s) at startup`));
}