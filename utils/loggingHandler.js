let formats = require('./timeFormatter');
async function getGuildConfig(client, guildid){
    let data = (await client.db.utils.find('guilds', {guildid: guildid}))[0];
    if (!data) data = await client.db.utils.newGuildConfig({guildid: guildid});
    return data;
}
function banAddRemove(user, guild, bool){
    let embed = {
        color: (bool?0xff5b42:0x5bff42), // Ban || Unban
        timestamp: Date.now(),
        thumbnail: user.avatarURL,
        footer: {
            text: `${user.id}`,
            icon_url: user.avatarURL
        },
        author: {
            name: `Member ${bool?'Banned':'Unbanned'}`,
            icon_url: user.avatarURL
        },
        description: `${user} ${user.tag}`,
        fields: [
            {
                name: 'Account Created:',
                value: `**${formats.dateFormat(user.createdAt)}** (\`${formats.msFormat(Date.now() - user.createdTimestamp)}\` ago)`
            }
        ]
    }
    console.log(`${bool?'[guildBanAdd]':'[guildBanRemove]'} ${user.tag}, ${guild.name}`);
    return embed;
}
function memberAddRemove(member, bool){
    let embed = {
        color: (bool?0x00ff1f:0xff001f), // Join || Leave
        timestamp: Date.now(),
        thumbnail: member.user.avatarURL,
        footer: {
            text: `${member.user.id}`,
            icon_url: member.user.avatarURL
        },
        author: {
            name: `Member ${bool?'Joined':'Left'}`,
            icon_url: member.user.avatarURL
        },
        description: `${member.user} ${member.user.tag}`,
        fields: [
            {
                name: 'Account Created:',
                value: `**${formats.dateFormat(member.user.createdAt)}** (\`${formats.msFormat(Date.now() - member.user.createdTimestamp)}\` ago)`
            }
        ]
    }
    console.log(`${bool?'[guildMemberAdd]':'[guildMemberRemove]'} ${member.user.tag}, ${member.guild.name}`);
    return embed;
}
//each export represents related event, all asynced to eliminate possibility of a mistake
exports.guildBanAdd = async (client, guild, user) => {
    let dbconfig = await getGuildConfig(client, guild.id);
    if (dbconfig.modules.logging.enabled && dbconfig.modules.logging.joinleave){
        let logchannel = guild.channels.get(dbconfig.modules.logging.joinleave);
        if (logchannel) return await logchannel.send({embed:banAddRemove(user, guild, true)});
    }
}
exports.guildBanRemove = async (client, guild, user) => {
    let dbconfig = await getGuildConfig(client, guild.id);
    if (dbconfig.modules.logging.enabled && dbconfig.modules.logging.joinleave){
        let logchannel = guild.channels.get(dbconfig.modules.logging.joinleave);
        if (logchannel) return await logchannel.send({embed:banAddRemove(user, guild, false)});
    }
}
exports.guildMemberAdd = async (client, member) => {
    let dbconfig = await getGuildConfig(client, member.guild.id);
    if (dbconfig.modules.logging.enabled && dbconfig.modules.logging.joinleave){
        let logchannel = member.guild.channels.get(dbconfig.modules.logging.joinleave);
        if (logchannel) return await logchannel.send({embed:memberAddRemove(member, true)});
    }
}
exports.guildMemberRemove = async (client, member) => {
    let dbconfig = await getGuildConfig(client, member.guild.id);
    if (dbconfig.modules.logging.enabled && dbconfig.modules.logging.joinleave){
        let logchannel = member.guild.channels.get(dbconfig.modules.logging.joinleave);
        if (logchannel) return await logchannel.send({embed:memberAddRemove(member, false)});
    }
}
exports.messageDelete = async (client, message) => {
    let dbconfig = await getGuildConfig(client, message.guild.id);
    if (dbconfig.modules.logging.enabled && dbconfig.modules.logging.message){
        let logchannel = message.guild.channels.get(dbconfig.modules.logging.message);
        if (logchannel){
            let user = message.author;
            let embed = {
                color: 0x2b2321,
                timestamp: Date.now(),
                footer: {
                    text: `${user?`${user.id} | `:''}${message.id}`,
                    icon_url: user?user.avatarURL:null
                },
                author: {
                    name: 'Message Deleted',
                    icon_url: user?user.avatarURL:''
                },
                description: `${user?`${user} (${user.tag})`:'unknown#0000'} in ${message.channel} ${user?` (after ${formats.msFormat(Date.now() - message.createdTimestamp)})`:''}`,
                fields: [
                    {
                        name: 'Deleted Message',
                        value: user?(message.content?message.content:'null'):"unknown, message wasn't cached before event emit"
                    }
                ]
            }
            console.log(`[messageDelete] message '${message.id}' deleted in '${message.channel}'`);
            return await logchannel.send({embed:embed});
        }
    }
}
exports.messageUpdate = async (client, oldMessage, newMessage) => {
    let dbconfig = await getGuildConfig(client, newMessage.guild.id);
    if (dbconfig.modules.logging.enabled && dbconfig.modules.logging.message){
        let logchannel = newMessage.guild.channels.get(dbconfig.modules.logging.message);
        if (logchannel){
            let embed = {
                color: 0xb38a04,
                timestamp: Date.now(),
                footer: {
                    text: `${newMessage.author.id} | ${oldMessage.id}`,
                    icon_url: newMessage.author.avatarURL
                },
                author: {
                    name: `Message Edited (after ${formats.msFormat(newMessage.editedTimestamp - (oldMessage.channel ? oldMessage.createdTimestamp : Date.parse(oldMessage.timestamp)) )})`,
                    icon_url: newMessage.author.avatarURL
                },
                description: `User: ${newMessage.author} (${newMessage.author.tag})\nChannel: ${newMessage.channel} (${newMessage.channel.name})\n[**link**](${newMessage.url})`,
                fields: [
                    {
                        name: 'Previous Message',
                        value: oldMessage.channel?(oldMessage.content?oldMessage.content:'null'):"unknown, message wasn't cached before event emit"
                    },
                    {
                        name: 'New Message',
                        value: newMessage.content?newMessage.content:'null'
                    }
        
                ]
            }
            console.log(`[messageUpdate] message '${newMessage.id}' edited in '${newMessage.channel}'`);
            return await logchannel.send({embed:embed});
        }
    }
}