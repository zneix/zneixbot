exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Kicks user from the server.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <@mention | user ID> [kick reason]`;
exports.perms = [false, false, 'KICK_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('KICK_MEMBERS')) return {code: '23', msg: 'Kick Members'};
        let taggedMember = message.mentions.members.first();
        if (!taggedMember){
            let validMember = message.guild.members.get(message.args[0]);
            if (!validMember) return {code: '15', msg: 'Unknown member, provide user ID or @mention them'};
            return execute(validMember);
        }
        else return execute(taggedMember);

        async function execute(member){
            //clearances
            if (!member.kickable) return {code: '22', msg: member.user.tag};
            if (!message.perms.sufficientRole(message.member, member)) return {code: '12', msg: member.user.tag};

            //reason compilation
            let reason = "No reason given.";
            if (message.args.length > 1) reason = message.args.slice(1).join(" ");

            //actual kick
            await member.kick(reason+"\nResponsible moderator: "+message.author.tag);
            require('../src/embeds/memberKickedBanned')(message, member, reason, false);
        }
    });
}