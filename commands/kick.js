exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Kicks user from the server.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [@mention | userID] (reason)`;
exports.perms = [false, false, 'KICK_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('KICK_MEMBERS')) throw "I don't have **KICK_MEMBERS** permission!\nContact moderators.";
        let taggedMember = message.mentions.members.first();
        if (!taggedMember) {
            let validMember = message.guild.members.get(message.args[0]);
            if (!validMember) throw "Please @mention a user or provide their ID!";
            return execute(validMember);
        }
        else return execute(taggedMember);

        async function execute(member){
            //clearances
            if (!member.kickable) throw `I can't kick ${member}!\nThey may have higher role.`;
            if (!message.perms.sufficientRole(message.member, member)) throw `You're not able to kick ${member} because of role hierachy!`;

            //reason compilation
            let reason = "No reason given.";
            if (message.args.length > 1) reason = message.args.slice(1).join(" ");

            //actual kick
            await member.kick(reason+"\nResponsible moderator: "+message.author.tag);
            require('../src/embeds/memberKickedBanned')(message, member, reason, false);
        }
    });
}