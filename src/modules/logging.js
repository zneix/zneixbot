let formatter = require('../utils/formatter');
function banAddRemove(guild, user, bool){
    let date = new Date();
    let embed = {
        color: bool ? 0x122334 : 0xfeeddc, // Ban || Unban
        timestamp: date,
        thumbnail: user.avatarURL({format:'png', dynamic:true}),
        footer: {
            text: user.id,
            icon_url: user.avatarURL({format:'png', dynamic:true})
        },
        author: {
            name: `Member ${bool ? 'Banned' : 'Unbanned'}`,
            icon_url: user.avatarURL({format:'png', dynamic:true})
        },
        description: `${user} ${user.tag}`,
        fields: [
            {
                name: 'Account Created:',
                value: `**${formatter.dateFormat(user.createdAt)}, ${formatter.hourFormat(user.createdAt)}** (\`${formatter.msToHuman(date.getTime() - user.createdTimestamp, 3)}\` ago)`
            }
        ]
    }
    console.log(`${`[guildBan${bool ? 'Add' : 'Remove'}]`} ${user.tag}, ${guild.name}`);
    return embed;
}
function memberAddRemove(member, bool){
    let date = new Date();
    let embed = {
        color: bool ? 0x00ff1f : 0xff001f, // Join || Leave
        timestamp: date,
        thumbnail: member.user.avatarURL({format:'png', dynamic:true}),
        footer: {
            text: member.user.id,
            icon_url: member.user.avatarURL({format:'png', dynamic:true})
        },
        author: {
            name: `Member ${bool ? 'Joined' : 'Left'}`,
            icon_url: member.user.avatarURL({format:'png', dynamic:true})
        },
        description: `${member.user} ${member.user.tag}`,
        fields: [
            {
                name: 'Account Created:',
                value: `**${formatter.dateFormat(member.user.createdAt)}, ${formatter.hourFormat(member.user.createdAt)}** (\`${formatter.msToHuman(date.getTime() - member.user.createdTimestamp, 3)}\` ago)`
            }
        ]
    }
    console.log(`${`[guildMember${bool ? 'Add' : 'Remove'}]`} ${member.user.tag}, ${member.guild.name}`);
    return embed;
}
//each export represents related event, all asynced to eliminate possibility of a mistake
exports.guildBanAdd = async (guild, user) => {
    let config = client.go[guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.banunban){
        let logchannel = guild.channels.cache.get(config.modules.logging.banunban);
        if (logchannel) return await logchannel.send({embed:banAddRemove(guild, user, true)});
    }
}
exports.guildBanRemove = async (guild, user) => {
    let config = client.go[guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.banunban){
        let logchannel = guild.channels.cache.get(config.modules.logging.banunban);
        if (logchannel) return await logchannel.send({embed:banAddRemove(guild, user, false)});
    }
}
exports.guildMemberAdd = async member => {
    let config = client.go[member.guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.joinleave){
        let logchannel = member.guild.channels.cache.get(config.modules.logging.joinleave);
        if (logchannel) return await logchannel.send({embed:memberAddRemove(member, true)});
    }
}
exports.guildMemberRemove = async member => {
    let config = client.go[member.guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.joinleave){
        let logchannel = member.guild.channels.cache.get(config.modules.logging.joinleave);
        if (logchannel) return await logchannel.send({embed:memberAddRemove(member, false)});
    }
}
exports.messageDelete = async message => {
    let config = client.go[message.guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.message){
        let logchannel = message.guild.channels.cache.get(config.modules.logging.message);
        if (logchannel){
            let date = new Date();
            let embed = {
                color: 0x2b2321,
                timestamp: date,
                footer: {
                    text: `${message.author ? `${message.author.id} | ` : ''} ${message.id}`,
                    icon_url: message.author ? message.author.avatarURL({format:'png', dynamic:true}) : null
                },
                author: {
                    name: `Message Deleted${message.author ? ` (msg age ${formatter.msToHuman(date.getTime() - message.createdTimestamp, 3)})` : ''}`,
                    icon_url: message.author ? message.author.avatarURL({format:'png', dynamic:true}) : null
                },
                description: `${message.author ? `${message.author} (${message.author.tag})` : 'unknown#0000'} in ${message.channel}`,
                fields: []
            }
            if (message.content){
                embed.fields.push({
                    name: 'Deleted Message',
                    value: message.content
                });
            }
            if (message.attachments ? message.attachments.size : false){
                let attachmentsString = message.attachments.map(file => `(${formatter.bytesToUnits(file.size)}${file.height ? `, ${file.height}x${file.width}` : ''}) ${file.name}`).join('\n');
                if (config.modules.logging.mediamirror){
                    let mirrorData = (await client.db.utils.find('mirroredmedia', {messageid: message.id}))[0];
                    if (mirrorData) attachmentsString = `[jump to media mirror](${mirrorData.mirrorMessageURL})\n` + attachmentsString;
                    else attachmentsString = `no media mirror available\n` + attachmentsString;
                }
                embed.fields.push({
                    name: 'File Attachments',
                    value: attachmentsString
                });
            }
            console.log(`[messageDelete] ${message.id} in #${message.channel.name} (${message.channel.id})`);
            return await logchannel.send({embed:embed});
        }
    }
}
exports.messageDeleteBulk = async messages => {
    let config = client.go[messages.first().guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.message){
        let logchannel = messages.first().guild.channels.cache.get(config.modules.logging.message);
        if (logchannel){
            let date = new Date();
            let embed = {
                color: 0x2b2321,
                timestamp: date,
                footer: {
                    text: `${messages.size} deleted messages`,
                    icon_url: ''
                },
                author: {
                    name: `${messages.size} Messages Deleted (avg message age: ${formatter.msToHuman(date.getTime() - Math.floor(messages.map(msg => msg.createdTimestamp).reduce((a, b) => a+b, 0) / messages.size ), 3)})`,
                },
                description: messages.map(message => `${message.attachments.size ? `${message.attachments.size} 📎` : ''} [${message.author.tag}]: ${message.content || '*N/A*'}`).join('\n').slice(0, 1023), //slicing, to prevent overflows
            }
            console.log(`[messageDeleteBulk] ${messages.size} messages in #${logchannel.name} (${logchannel.id})`);
            return await logchannel.send({embed:embed});
        }
    }
}
exports.messageUpdate = async (oldMessage, newMessage) => {
    let config = client.go[newMessage.guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.message){
        let logchannel = newMessage.guild.channels.cache.get(config.modules.logging.message);
        if (logchannel){
            let embed = {
                color: 0xb38a04,
                timestamp: new Date(),
                footer: {
                    text: `${newMessage.author.id} | ${newMessage.id}`,
                    icon_url: newMessage.author.avatarURL({format:'png', dynamic:true})
                },
                author: {
                    name: `Message Edited (msg age ${formatter.msToHuman(newMessage.editedTimestamp - (oldMessage.channel ? oldMessage.createdTimestamp : Date.parse(oldMessage.timestamp)), 3)})`,
                    icon_url: newMessage.author.avatarURL({format:'png', dynamic:true})
                },
                description: `User: ${newMessage.author} (${newMessage.author.tag})\nChannel: ${newMessage.channel} (${newMessage.channel.name})\n[**link**](${newMessage.url})`,
                fields: []
            }
            if (oldMessage.content){
                embed.fields.push({
                    name: 'Previous Message',
                    value: oldMessage.content
                });
            }
            if (newMessage.content){
                embed.fields.push({
                    name: 'New Message',
                    value: newMessage.content
                });
            }
            if (newMessage.attachments ? newMessage.attachments.size : false){
                embed.fields.push({
                    name: 'File Attachments',
                    value: newMessage.attachments.map(file => `(${formatter.bytesToUnits(file.size)}${file.height ? `, ${file.height}x${file.width}` : ''}) ${file.name}`).join('\n')
                });
            }
            console.log(`[messageUpdate] message ${newMessage.id} in #${newMessage.channel.name} (${newMessage.channel.id})`);
            return await logchannel.send({embed:embed});
        }
    }
}
exports.usernameUpdate = async (oldUser, newUser) => {
    //fetching the user in case it's not in cache (?)
    if (!client.users.cache.get(newUser.id)) await client.users.fetch(newUser.id);
    Object.keys(client.go).filter(guildID => client.go[guildID].config.modules.logging.enabled && client.go[guildID].config.modules.logging.name).forEach(async guildID => {
        //logging updates only for available guilds
        let guild = client.guilds.cache.get(guildID);
        if (!guild.available) return console.log(`[!userUpdate:username] ${oldUser.tag} => ${newUser.tag} ; GUILD UNAVAILABLE! ${guildID}`);
        //checking if user is a member of the server
        if (!guild.member(newUser.id)) return;
        let logchannel = guild.channels.cache.get(client.go[guildID].config.modules.logging.name);
        if (logchannel){
            console.log(`[userUpdate:username] ${oldUser.tag} => ${newUser.tag} ; logging to guild ${guildID}`);
            return await logchannel.send({embed:{
                color: 0x6df3b8,
                timestamp: new Date(),
                footer: {
                    text: `${newUser.tag} | ${newUser.id}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${newUser.id}/${newUser.avatar}`
                },
                author: {
                    name: `${oldUser.username == newUser.username ? 'Discriminator' : 'Username'} changed`
                },
                description: `Old: ${oldUser.tag}\nNew: ${newUser.tag}`
            }});
        }
    });
}
exports.nicknameUpdate = async (oldMember, newMember) => {
    let config = client.go[newMember.guild.id].config;
    if (config.modules.logging.enabled && config.modules.logging.name){
        let logchannel = newMember.guild.channels.cache.get(config.modules.logging.name);
        if (logchannel){
            console.log(`[guildMemberUpdate:nickname] ${oldMember.nickname} => ${newMember.nickname} in ${newMember.guild.id}`);
            let nickState = 'changed'; // string => string
            if (!oldMember.nickname) nickState = 'set'; // null => string
            if (!newMember.nickname) nickState = 'removed'; //string => null
            logchannel.send({embed:{
                color: 0xa3e0ca,
                timestamp: new Date(),
                footer: {
                    text: `${newMember.user.tag} | ${newMember.user.id}`,
                    icon_url: newMember.user.avatarURL({format:'png', dynamic:true})
                },
                author: {
                    name: `Nickname ${nickState}`
                },
                description: `${oldMember.nickname ? `Old: ${oldMember.nickname}` : ''}\n${newMember.nickname ? `New: ${newMember.nickname}` : ''}`.trim() || '*No data... That shouldn\'t happen, contact dev pls*'
            }});
        }
    }
}