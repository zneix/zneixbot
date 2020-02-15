exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Bans user from the server (without deleting user messages).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <@mention | user ID> [reason]`;
exports.perms = [false, false, 'BAN_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return {code: '23', msg: 'Ban Members'}
        let taggedMember = message.mentions.members.first();
        if (!taggedMember){
            // let validMember = message.guild.members.get(message.args[0]);
            if (!/^\d+$/.test(message.args[0])) return {code: '15', msg: "That is not a user ID nor @mention!"};
            return execute(message.args[0]);
        }
        else return execute(taggedMember);

        async function execute(member){
            //reason compilation
            let reason = "No reason given.";
            if (message.args.length > 1) reason = message.args.slice(1).join(" ");

            //banning by ID
            if (typeof member !== "object"){
                //check and 'error' emit if user is already banned
                let check = await message.guild.fetchBans();
                if (check.get(member)){
                    let aban = await message.guild.fetchBan(member);
                    return require('../src/embeds/memberKickedBanned')(message, `<@${member}>`, aban.reason, "banerror");
                }
                if (message.guild.members.get(member)){
                    let d = clearance(message.member, message.guild.members.get(member));
                    if (d) if (d.code) return d;
                }
                await message.guild.ban(member, reason+" | Responsible moderator: "+message.author.tag);
                return require('../src/embeds/memberKickedBanned')(message, member, reason, true);
            }
            //clearances
            function clearance(msgmember, reqmember){
                if (!reqmember.bannable) return {code: '22', msg: reqmember.user.tag};
                if (!message.perms.sufficientRole(msgmember, reqmember)) return {code: '12', msg: reqmember.user.tag};
            }
            let d = clearance(message.member, member);
            if (d) if (d.code) return d;

            //actual ban
            // await member.ban(reason+" | Responsible moderator: "+message.author.tag);
            // require('../src/embeds/memberKickedBanned')(message, member, reason, true);
            let val = await member.ban(reason+" | Responsible moderator: "+message.author.tag)
            .catch(e => {return {code: '15', msg: e.toString()}})
            .then(() => require('../src/embeds/memberKickedBanned')(message, member, reason, true));
            return val;
        }
    });
}