module.exports = async client => {
    require('../src/utils/presence')(client);
    let doc = {
        readyAt: client.readyAt,
        readyTimestamp: client.readyTimestamp,
        size: {
            guilds: client.guilds.size,
            users: client.users.size
        }
    }
    await client.db.utils.insert('logready', [doc]);
    // await client.db.db().collection('logready').insertOne(doc);
    require('../src/utils/logger').ready(client);
    // client.logger.ready(); //call logger here
    await client.agenda.start(); //start the agenda once client is ready
    console.log('[agenda] Started job processing!');
}