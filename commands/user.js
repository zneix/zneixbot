exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Displays various information about user.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [user ID | @mention]`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        const time = require('../utils/timeFormatter');
        if (!message.args.length) return result(message.author);
        let taggedUser = message.mentions.users.first();
        if (!taggedUser){
            let validUser = client.users.get(message.args[0]);
            if (validUser) return result(validUser);
            else return result(message.author);
        }
        else return result(taggedUser);
        async function result(user){
            let member = message.guild.members.get(user.id);
            let arr = [];
            member?member.roles.forEach(r => {if (r.id !== message.guild.id) arr.push(r.toString())}):null //roles thingy
            let embed = {
                color: 0x2f3136,
                timestamp: message.createdAt,
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
                description: `${user.toString()} ${user.presence.status==="offline"?"offline":user.presence.status==="online"?"online":`online (${user.presence.status})`}`,
                fields: [
                    {
                        name: "User ID",
                        value: user.id,
                        inline: false
                    },
                    {
                        name: "Created at",
                        value: `${time.dateFormat(user.createdAt)}\n\`${time.msFormat(message.createdAt-user.createdTimestamp)} ago\``,
                        inline: true
                    }
                ]
            }
            if (member){
                await message.guild.fetchMembers();
                let joinPos = [...message.guild.members.sort((a, b) => a.joinedAt - b.joinedAt).keys()].indexOf(member.user.id)+1;
                embed.fields.push({
                    name: 'Joined at',
                    value: `${time.dateFormat(member.joinedAt)}\n\`${time.msFormat(message.createdAt-member.joinedTimestamp)} ago\` (**${joinPos}${time.numeralSuffix(joinPos)}** to join)`,
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
                if (member.displayColor){
                    embed.fields.push({
                        name: 'Color',
                        value: `#${parseInt(embed.color).toString(16)}`,
                        inline: true
                    });
                }
                //Moderator Permissions
                let modPermsObj = {
                    'KICK_MEMBERS': 'Kick Members',
                    'BAN_MEMBERS': 'Ban Members',
                    'ADMINISTRATOR': '**Administrator**',
                    'MANAGE_CHANNELS': 'Manage Channels',
                    'MANAGE_GUILD': 'Manage Server',
                    'MANAGE_MESSAGES': 'Manage Messages',
                    'MENTION_EVERYONE': 'Mention Everyone',
                    'MANAGE_NICKNAMES': 'Manage Nicknames',
                    'MANAGE_ROLES': 'Manage Roles',
                    'MANAGE_WEBHOOKS': 'Manage Webhooks',
                    'MANAGE_EMOJIS': 'Manage Emojis'
                };
                let modPerms = Object.getOwnPropertyNames(modPermsObj);
                if (member.permissions.toArray().some(x => modPerms.includes(x))){
                    let memberPerms = modPerms.filter(x => member.permissions.toArray().includes(x));
                    let permsFormat = function(){
                        let locarr = [];
                        for (i=0;i<memberPerms.length;i++){
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
                if (Acknowledge()){
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