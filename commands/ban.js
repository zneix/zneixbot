exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Bans user from the server (without deleting user messages).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [@mention | userID] (reason)`;
exports.perms = [false, false, 'BAN_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw "I don't have **BAN_MEMBERS** permission!\nContact moderators.";
        let taggedMember = message.mentions.members.first();
        if (!taggedMember){
            // let validMember = message.guild.members.get(message.args[0]);
            if (!/^\d+$/.test(message.args[0])) throw "That is not a user ID nor @mention!";
            return execute(message.args[0]);
        }
        else return execute(taggedMember);

        async function execute(member){
            //reason compilation
            let reason = "No reason given.";
            if (message.args.length > 1) reason = message.args.slice(1).join(" ");

            //banning by ID
            if (typeof member !== "object"){
                //check and 'error' throw if user is already banned
                let check = await message.guild.fetchBans();
                if (check.get(member)){
                    let aban = await message.guild.fetchBan(member);
                    return require('../src/embeds/memberKickedBanned')(message, `<@${member}>`, aban.reason, "banerror");
                }
                if (message.guild.members.get(member)) clearance(message.member, message.guild.members.get(member));
                await message.guild.ban(member, reason+"\nResponsible moderator: "+message.author.tag);
                require('../src/embeds/memberKickedBanned')(message, member, reason, true);
                return;
            }
            //clearances
            function clearance(msgmember, reqmember){
                if (!reqmember.bannable) throw `I can't ban ${reqmember}!\nThey may have higher role.`;
                if (!message.perms.sufficientRole(msgmember, reqmember)) throw `You're not able to ban ${reqmember} because of role hierachy!`;
            }
            clearance(message.member, member);

            //actual ban
            await member.ban(reason+"\nResponsible moderator: "+message.author.tag);
            require('../src/embeds/memberKickedBanned')(message, member, reason, true);
        }
    });
}