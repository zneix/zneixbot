let mongodb = require('mongodb');
let auth = require('../src/json/auth');
let uri = `mongodb+srv://${auth.db.user}:${auth.db.pass}@${auth.db.host}/zneixbot`;
let client = new mongodb.MongoClient(uri, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	keepAlive: true,
	keepAliveInitialDelay: 60000,
	poolSize: 30,
	socketTimeoutMS: 360000,
	connectTimeoutMS: 360000
});
let lvldb = 'zneixbotleveling'; //name of database with leveling info

//mongodb general utils
client.utils = new Object;
//reconnection
client.utils.reconnect = async function(){
	await client.close();
    return await client.connect().then(() => console.log('[mongodb] Reconeccted!')).catch(err => console.log(`[!mongodb] Error while reconnecting:\n${err}`));
}
//terminating current connection
client.utils.disconnect = async function(){
    return await client.close().then(() => console.log('[mongodb] Closed connection!')).catch(err => console.log(`[!mongodb] Error while closing connection:\n${err}`));
}
//logging into
client.utils.connect = connect();
async function connect(){
    return await client.connect().then(() => console.log('[mongodb] Connected!')).catch(err => console.log(`[!mongodb] Error while connecting:\n${err}`));
}
//finding documents
client.utils.find = async function(collectionName, filter){
	if (!collectionName) return "collection name can't be null";
	if (!client.isConnected()) await connect();
	return await client.db().collection(collectionName).find(filter).toArray();
}
//inserting documents
client.utils.insert = async function(collectionName, docs){
	if (!collectionName) return "collection name can't be null";
	if (!client.isConnected()) await connect();
	return await client.db().collection(collectionName).insertMany(docs);
}
//updating single document
client.utils.replaceOne = async function(collectionName, filter, D_OMEGALUL_C){
	if (!collectionName) return "collection name can't be null";
	if (!client.isConnected()) await connect();
    return await client.db().collection(collectionName).findOneAndReplace(filter, D_OMEGALUL_C);
}
//deleting documents
client.utils.delete = async function(collectionName, filter){
	if (!collectionName) return "collection name can't be null";
	if (!client.isConnected()) await connect();
	return await client.db().collection(collectionName).deleteMany(filter);
}
//new config template insertion
client.utils.newGuildConfig = async function(guildid){
	let template = {
		guildid: guildid,
		customprefix: null,
		modrole: null,
		modules: {
			leveling: {
				enabled: false,
				announcetype: 'embed',
				blacklist: [],
				blocked: [],
				rewards: {}
			},
			roles: {
				enabled: false,
				units: {}
			},
			logging: {
				enabled: false,
				joinleave: null,
				message: null
			}
		}
	}
	if (!client.isConnected()) await connect();
	return (await client.db().collection('guilds').insertOne(template)).ops[0];
}

//mongodb leveling module utils
client.lvl = new Object;
//getting user level info
client.lvl.findUser = async function(guildid, userid){
	if (!client.isConnected()) await connect();
	return await client.db(lvldb).collection(guildid).find({userid: userid}).toArray();
}
client.lvl.updateUser = async function(guildid, D_OMEGALUL_C){
	if (!client.isConnected()) await connect();
	return await client.db(lvldb).collection(guildid).findOneAndReplace({userid: D_OMEGALUL_C.userid}, D_OMEGALUL_C);
}
//new user level info insertion
client.lvl.newUser = async function(guildid, userid){
	if (!client.isConnected()) await connect();
	(await client.db(lvldb).listCollections().toArray()).some(x => x.name === guildid)?null:(await client.db(lvldb).createCollection(guildid));
	let template = {
		userid: userid,
		lvl: 0,
		xp: 0
	}
	return (await client.db(lvldb).collection(guildid).insertOne(template)).ops[0];
}
//finding and sorting elements in leveling collection
client.lvl.getLeaderboard = async function(guildid){
	return await client.db(lvldb).collection(guildid).find().sort('xp', -1).toArray();
}
//getting user positions and document count for rank.js command
client.lvl.getRanking = async function(guildid, userid){
	let all = await client.db(lvldb).collection(guildid).countDocuments();
	let userArr = (await client.db(lvldb).collection(guildid).find({}, {projection: {userid: userid, _id: null}}).sort('xp', -1).toArray());
	for (i=0;i<userArr.length;i++) if (userArr[i].userid == userid) return (i+1)+'/'+all;
}

//mongodb-related listeners for topology and failed heartbeats information
client.on('serverHeartbeatFailed', function(event) {
	console.log('[mongodb:event] Heartbeat FAILED!');
});
client.on('topologyOpening', function(event) {
	console.log('[mongodb:event] Server topology is OPENING!');
});
client.on('topologyClosed', function(event) {
	console.log('[mongodb:event] Server topology has CLOSED!');
});

//process listeners for database disconnecting once process terminates
process.on('SIGINT', async () => {
	await client.close().then(() => console.log('[mongodb] Closed upon SIGINT!'));
	process.exit();
});
process.on('exit', code => console.log('[node] Process exited with code '+code));

module.exports = client;