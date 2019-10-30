const mongodb = require('mongodb');
const auth = require('../src/json/auth')();
let uri = `mongodb+srv://${auth.db.user}:${auth.db.pass}@${auth.db.host}/zneixbot`;
let client = new mongodb.MongoClient(uri, {useUnifiedTopology: true});

//mongodb utils
client.utils = new Object;
//reconnection
client.utils.reconnect = async function(){
    await client.close();
    return await client.connect().then(() => console.log('[mongodb] Reconeccted!')).catch(err => console.log(`[!mongodb] Error while reconnecting:\n${err}`));
}
//terminating current connection
client.utils.close = async function close(){
    return await client.close().then(() => console.log('[mongodb] Closed connection!')).catch(err => console.log(`[!mongodb] Error while closing connection:\n${err}`));
}
//logging into
client.utils.connect = async function(){
    return await client.connect().then(() => console.log('[mongodb] Connected!')).catch(err => console.log(`[!mongodb] Error while connecting:\n${err}`));
}
//finding documents
client.utils.find = async function(collectionName, filter){
	if (!collectionName) return "collection name can't be null";
	return client.db().collection(collectionName).find(filter).toArray();
}
client.utils.insert = async function(collectionName, docs){
	if (!collectionName) return "collection name can't be null";
	return client.db().collection(collectionName).insertMany(docs);
}
//mongodb-related listeners for topology and failed heartbeats information
client.on('serverHeartbeatFailed', function(event) {
	console.log('[mongodb:event] Heartbeat FAILED!');
});
client.on('topologyOpening', function(event) {
	console.log('[mongodb:event] Server topology is OPENING!');
});
client.on('topologyClosed', function(event) {
	console.log('[mongodb:event] Server topology is CLOSING!');
});

//process listeners for database disconnecting once process terminates
process.on('SIGINT', async () => {
	await client.close().then(() => console.log('[mongodb] Closed upon SIGINT!'));
	process.exit();
});
process.on('exit', code => console.log('[node] Process exited with code '+code));

module.exports = client;