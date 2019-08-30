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
                    }
                ]
            }
            if (member) {
                embed.fields.push({
                    name: 'Joined at',
                    value: time.dateFormat(member.joinedAt)+` \`${time.msFormat(Date.now()-member.joinedTimestamp)} ago\``,
                    inline: true
                });
                embed.fields.push({
                    name: `Roles [${arr.length}]`,
                    value: 
                        arr.length?
                            arr.join(" ").length<1023?
                                arr.join(" ")
                                :arr.join(" ").substr(0, 1012)+"\n[truncated]"
                        :"None.",
                    inline: false
                });
                //Moderator Permissions
                let modPermsObj = {
                    'KICK_MEMBERS': 'Kick Members',
                    'BAN_MEMBERS': 'Ban Members',
                    'ADMINISTRATOR': 'Administrator',
                    'MANAGE_CHANNELS': 'Manage Channels',
                    'MANAGE_SERVER': 'Manage Server',
                    'MANAGE_MESSAGES': 'Manage Messages',
                    'MENTION_EVERYONE': 'Mention Everyone',
                    'MANAGE_NICKNAMES': 'Manage Nicknames',
                    'MANAGE_ROLES': 'Manage Roles',
                    'MANAGE_WEBHOOKS': 'Manage Webhooks',
                    'MANAGE_EMOJIS': 'Manage Emojis'
                };
                let modPerms = Object.getOwnPropertyNames(modPermsObj);
                if (member.permissions.toArray().some(x => modPerms.includes(x))) {
                    let memberPerms = modPerms.filter(x => member.permissions.toArray().includes(x));
                    let permsFormat = function(){
                        let locarr = [];
                        for (i=0;i<memberPerms.length;i++) {
                            locarr.push(modPermsObj[memberPerms[i]]);
                        }
                        return locarr;
                    }
                    embed.fields.push({
                        name: 'Moderator Permissions',
                        value: permsFormat().join(', '),
                        inline: false
                    });
                }
                //Server Acknowledgements
                let Acknowledge = function(){
                    if (member.guild.ownerID === member.id) return "Server Owner";
                    if (member.permissions.has('ADMINISTRATOR')) return "Server Administrator";
                    // let modPerms = [
                    //     'BAN_MEMBERS',
                    //     'MANAGE_CHANNELS',
                    //     'MANAGE_SERVER',
                    //     'MANAGE_ROLES'
                    // ];
                    // if (member.permissions.toArray().some(x => modPerms.includes(x))) return "Server Moderator";
                    return false;
                }
                if (Acknowledge()) {
                    embed.fields.push({
                        name: "Acknowledgements",
                        value: Acknowledge(),
                        inline: false
                    });
                }
            }
            return message.channel.send({embed:embed});
        }
    });
}