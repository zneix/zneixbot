module.exports = async invite => {
    if (!invite.guild) return; //https://discord.js.org/#/docs/main/stable/class/Invite?scrollTo=guild
    await require('../src/utils/loader').getGuildConfig(invite.guild);
    if (!client.go[invite.guild.id].config.modules.logging.invite) return;
    //inserting new invites for invite tracking to both cache and database
    client.go[invite.guild.id].invites.set(invite.code, {
		inviterid: invite.inviter.id,
		code: invite.code,
		uses: invite.uses,
		deleted: false
    });
	await client.db.db(client.db.ops.invitedb).collection(invite.guild.id).insertOne(client.go[invite.guild.id].invites.get(invite.code));
}