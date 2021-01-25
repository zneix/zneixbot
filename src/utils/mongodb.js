const mongodb = require('mongodb');
const ops = require('../json/auth').db;
const uri = `mongodb://${ops.host}/${ops.maindb}`;
const mclient = new mongodb.MongoClient(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 60000,
    poolSize: 30,
    socketTimeoutMS: 360000,
    connectTimeoutMS: 360000,
    auth: {
        password: ops.password,
        user: ops.username
    },
    authSource: ops.authdb
});
//utils
mclient.utils = new Object;
//reconnection
mclient.utils.reconnect = async () => {
	await mclient.close();
    return await mclient.connect().then(() => console.log('[mongodb] Reconeccted!')).catch(err => console.log(`[!mongodb] Error while reconnecting:\n${err}`));
}
//terminating current connection
mclient.utils.disconnect = async () => {
    return await mclient.close().then(() => console.log('[mongodb] Closed connection!')).catch(err => console.log(`[!mongodb] Error while closing connection:\n${err}`));
}
//logging into
async function connect() {
    return await mclient.connect().then(() => console.log('[mongodb] Connected!')).catch(err => console.log(`[!mongodb] Error while connecting:\n${err}`));
}
mclient.utils.connect = connect();
//finding documents
mclient.utils.find = async (collectionName, filter) => {
	if (!collectionName) return "collection name can't be null";
	if (!mclient.isConnected()) await connect();
	return await mclient.db().collection(collectionName).find(filter).toArray();
}
//inserting documents
mclient.utils.insert = async (collectionName, docs) => {
	if (!collectionName) return "collection name can't be null";
	if (!mclient.isConnected()) await connect();
	return await mclient.db().collection(collectionName).insertMany(docs);
}
//updating single document
mclient.utils.replaceOne = async (collectionName, filter, D_OMEGALUL_C) => {
	if (!collectionName) return "collection name can't be null";
	if (!mclient.isConnected()) await connect();
	return await mclient.db().collection(collectionName).findOneAndReplace(filter, D_OMEGALUL_C);
}
//deleting documents
mclient.utils.delete = async (collectionName, filter) => {
	if (!collectionName) return "collection name can't be null";
	if (!mclient.isConnected()) await connect();
	return await mclient.db().collection(collectionName).deleteMany(filter);
}
//get "autoincrementation" (kill me for this shitty workaround, perhaps should switch to sql already)
mclient.utils.getAutoincrement = async collectionName =>{
	if (!mclient.isConnected()) await connect();
	const result = await mclient.db().collection(ops.incrcol).findOneAndUpdate({_id: collectionName }, {$inc: { count: 1 }});
	if (result.value) return result.value.count+1; //returning already existing document with elevated value
	else return (await mclient.db().collection(ops.incrcol).insertOne({_id: collectionName, count: 1})).ops[0].count; //inserting new entry to database and returning it
}
//getting permission levels from database
mclient.utils.permlevels = async () => {
	if (!mclient.isConnected()) await connect();
	const obj = new Object;
		const perms = (await mclient.db().collection(ops.permcol).find({}, {projection: {_id: null}}).sort('level', -1).toArray());
    const levels = perms.map(perm => perm.level).filter((value, index, self) => self.indexOf(value) === index);
    levels.forEach(lvl => obj[lvl.toString()] = []);
    perms.forEach(perm => obj[perm.level].push(perm.userid));
    return obj;
}
//new config template insertion
mclient.utils.newGuildConfig = async theid => {
	if (!mclient.isConnected()) await connect();
	console.log(`[mongodb] Attempting to insert configuration for ${theid}`);
	const template = {
		guildid: theid, //quick renaming due to big confusion and creating invalid objects
		customprefix: null,
		perms: [
			/*
			something like this could be inserted in here by config command, 'type' property is a string - can be only 'role' (role-baed perm) or 'user' (user-based perm)
			level should be only between perms.levels.minguildmod and perms.levels.maxguildmod
			level 100 can represent a server moderator
			level 200 can represent a server admin (server owner always has level of value perms.levels.maxguildmod)
			levels in between those can be held for server managers or something
			*/

			// {
			// 	id: '288028423031357441', //string
			// 	type: 'user', //string
			// 	level: 100 //number
			// }
		],
		modules: {
			leveling: {
				enabled: false,
				stackrewards: true,
				announcetype: 'embed',
				channel: null,
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
				invite: null,
				joinleave: null,
				banunban: null,
				message: null,
				mediamirror: null, //a channel in which all attachments will be reuploaded (already right away after message event)
				name: null
			}
		}
	}
	return (await mclient.db().collection('guilds').insertOne(template)).ops[0];
}
//fetching, inserting new and updating existing invites for invite logging module
mclient.utils.syncTrackedInvites = async guildid => {
	if (!mclient.isConnected()) await connect();
	//query all invites already existing in database
	// let existingInvites = await mclient.db(ops.invitedb).collection(guildid).find({}).toArray();
	const Collection = require('discord.js').Collection;
	const existingInvites = new Collection((await mclient.db(ops.invitedb).collection(guildid).find({}).toArray()).map(i => [i.code, i]));
	const existingCodes = [...existingInvites.keys()];
	const guild = client.guilds.cache.get(guildid);
	const invites = new Collection((await guild.fetchInvites()).map(i => [i.code, {
		inviterid: i.inviter.id,
		code: i.code,
		uses: i.uses,
		deleted: false
	}]));
	// let invitesArrayToInsert = [...invites.keys()].filter(invCode => !existingCodes.includes(invCode)).map(invCode => invites.get(invCode));
	const invitesArrayToInsert = [...invites.filter(inv => !existingCodes.includes(inv.code)).values()];

	//append vanity URL but only if the guild has that feature
	const vanityData = new Object;
	if (guild.features.includes('VANITY_URL')){
		vanityData = await guild.fetchVanityData();
		invites.set(vanityData.code, {
			inviterid: null,
			code: vanityData.code,
			uses: vanityData.uses,
			deleted: false
		});
		if (!existingCodes.includes(vanityData.code)) invitesArrayToInsert.push(invites.get(vanityData.code));
	}

	//insert new ones (by excluding all existing ones), but only if there's anything to insert
	if (invitesArrayToInsert.length) mclient.db(ops.invitedb).collection(guildid).insertMany(invitesArrayToInsert);

	//flag invites that are in db (but not exist anymore) as deleted
	const deletedCodes = existingCodes.filter(code => !invites.has(code) && code != vanityData.code);
	if (deletedCodes.length) await mclient.db(ops.invitedb).collection(guildid).updateMany({code: { $in: deletedCodes }, deleted: false}, { $set: {deleted: true} });

	//update uses count for invites already existing in database
	const invitesToUpdate = invites
		.filter(inv => existingInvites.has(inv.code))
		.filter(inv => inv.uses != existingInvites.get(inv.code).uses);
	await Promise.all(invitesToUpdate.map(invite => {
		mclient.db(ops.invitedb).collection(guildid).findOneAndUpdate({code: invite.code}, { $set: {uses: invite.uses} });
	}));

	//binding small collection of invites to global cache object
	client.go[guild.id].invites = invites;
	return invites;
}
//inserting new invites on inviteCreate event
mclient.utils.trackNewInvite = async invite => {
	if (!mclient.isConnected()) await connect();
	mclient.db(ops.invitedb).collection(invite.guild.id).insertOne({
		inviterid: invite.inviter.id,
		code: invite.code,
		uses: invite.uses,
		deleted: false
	});
}
//updating invite data on guildMemberAdd event
mclient.utils.updateInvites = async invite => {}

//mongodb leveling module utils
mclient.lvl = new Object;
//getting user level info
mclient.lvl.findUser = async (guildid, userid) => {
	if (!mclient.isConnected()) await connect();
	return (await mclient.db(ops.lvldb).collection(guildid).find({userid: userid}).toArray())[0];
}
mclient.lvl.updateUser = async (guildid, userid, replaceQuery) => {
	if (!mclient.isConnected()) await connect();
	return await mclient.db(ops.lvldb).collection(guildid).findOneAndUpdate({userid: userid}, replaceQuery);
}
//new user level info insertion
mclient.lvl.newUser = async (guildid, userid) => {
	if (!mclient.isConnected()) await connect();
	if (!(await mclient.db(ops.lvldb).listCollections().toArray()).some(x => x.name == guildid)) await mclient.db(ops.lvldb).createCollection(guildid);
	return (await mclient.db(ops.lvldb).collection(guildid).insertOne({
		userid: userid,
		lvl: 0,
		xp: 0
	})).ops[0];
}
//finding and sorting elements in leveling collection
mclient.lvl.getLeaderboard = async guildid => {
	if (!mclient.isConnected()) await connect();
	return await mclient.db(ops.lvldb).collection(guildid).find().sort('xp', -1).toArray();
}
//getting user positions and document count for rank.js command
mclient.lvl.getRanking = async (guildid, userid) => {
	if (!mclient.isConnected()) await connect();
	const all = await mclient.db(ops.lvldb).collection(guildid).countDocuments();
	const userArr = (await mclient.db(ops.lvldb).collection(guildid).find().sort('xp', -1).toArray()).map(x => x.userid);
	return `${userArr.indexOf(userid) + 1}/${all}`;
}

//mongodb-related listeners for topology and failed heartbeats information
mclient.on('serverHeartbeatFailed', event => {
	console.log('[mongodb:event] Heartbeat FAILED!');
});
mclient.on('topologyOpening', event => {
	console.log('[mongodb:event] Server topology is OPENING!');
});
mclient.on('topologyClosed', event => {
	console.log('[mongodb:event] Server topology has CLOSED!');
});

//database disconnect before process terminates
mclient.SIGINT = async () => {
	await mclient.close().then(() => console.log('[mongodb] Closed upon SIGINT!'));
};

//appending information about database columns. while sanitizing credentials
['authdb', 'host', 'username', 'password'].forEach(el => {ops[el] = 'xd'});

mclient.ops = ops;
exports.client = mclient;