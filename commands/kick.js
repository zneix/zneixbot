exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Kicks user from the server.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [@mention | userID] (reason)`;
exports.perms = ['KICK_MEMBERS'];

exports.run = async (client, message) => {
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

        function execute(member){
            if (!member.kickable) throw `I can't kick ${member}!\nThey may have higher role.`;
            //skipping clearance if commander is a bot owner
            if (!message.perms.isOwner()) {
                if (message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) throw `You're not able to kick ${member} because of role hierachy!`;
            }

            //reason compilation
            let reason = "No reason given.";
            if (message.args.length > 1) reason = message.args.slice(1).join(" ");

            //actual kick
            member.kick(reason+"\nResponsible moderator: "+message.author.tag);
            require('../src/embeds/memberKickedBanned')(message, member, reason, false);
        }
    });
}