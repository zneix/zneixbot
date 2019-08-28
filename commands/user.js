exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Displays various information about user.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [user ID | @mention]`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        const time = require('../utils/timeFormatter');
        if (!message.args.length) return result(message.author);
        let taggedUser = message.mentions.users.first();
        if (!taggedUser) {
            let validUser = client.users.get(message.args[0]);
            if (validUser) return result(validUser);
            else return result(message.author);
        }
        else return result(taggedUser);
        function result(user){
            let member = message.guild.members.get(user.id);
            let arr = [];
            member?member.roles.forEach(r => {if (r.id !== message.guild.id) arr.push(r.toString())}):null //roles thingy
            var embed = {
                color: member?member.displayColor:0x000000,
                timestamp: new Date(),
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                author: {
                    name: user.tag,
                    icon_url: user.avatarURL
                },
                thumbnail: {
                    url: user.avatarURL
                },
                description: user.toString(),
                fields: [
                    {
                        name: "User ID",
                        value: user.id,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: user.presence.status==="offline"?"offline":user.presence.status==="online"?"online":`online (${user.presence.status})`
                    },
                    {
                        name: "Created at",
                        value: time.dateFormat(user.createdAt)+` \`${time.msFormat(Date.now()-user.createdTimestamp)} ago\``,
                        inline: true
                    },
                    {
                        name: "Joined at",
                        value: member?time.dateFormat(member.joinedAt)+` \`${time.msFormat(Date.now()-member.joinedTimestamp)} ago\``:"The user is not in this guild.",
                        inline: true
                    },
                    {
                        name: `Roles${member?` [${arr.length}]`:""}`,
                        value: 
                        member?
                            arr.length?
                                arr.join(" ").length<1023?
                                    arr.join(" ")
                                    :arr.join(" ").substr(0, 1012)+"\n[truncated]"
                                :"None."
                            :"The user is not in this guild.",
                        inline: false
                    }
                ]
            }
            return message.channel.send({embed:embed});
        }
    });
}