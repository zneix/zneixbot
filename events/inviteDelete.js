module.exports = async invite => {
    if (!invite.guild) return; //https://discord.js.org/#/docs/main/stable/class/Invite?scrollTo=guild
    await require('../src/utils/loader').getGuildConfig(invite.guild);
    if (!client.go[invite.guild.id].config.modules.logging.invite) return;

    //deleting invite from cache to save resources as we only need active ones in cache
    client.go[invite.guild.id].invites.delete(invite.code);

    //marking invites as deleted in database instead of deleting them
    //may be useful to keep them for some possible stats in future
    await client.db.db(client.db.ops.invitedb).collection(invite.guild.id).findOneAndUpdate({ code: invite.code }, { $set: {deleted: true} });
}