exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Bans user from the server (without deleting user messages).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [@mention | userID] (reason)`;
exports.perms = ['BAN_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw "I don't have **BAN_MEMBERS** permission!\nContact moderators.";
        let taggedMember = message.mentions.members.first();
        if (!taggedMember) {
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
            if (typeof member !== "object") {
                await message.guild.ban(member, reason+"\nResponsible moderator: "+message.author.tag);
                require('../src/embeds/memberKickedBanned')(message, member, reason, true);
                return;
            }
            if (!member.bannable) throw `I can't ban ${member}!\nThey may have higher role.`;
            //skipping clearance if commander is a bot owner
            if (!message.perms.isOwner()) {
                if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) throw `You're not able to ban ${member} because of role hierachy!`;
            }

            //actual ban
            await member.ban(reason+"\nResponsible moderator: "+message.author.tag);
            require('../src/embeds/memberKickedBanned')(message, member, reason, true);
        }
    });
}