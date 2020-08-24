let formatter = require('../utils/formatter');
function banAddRemove(guild, user, bool){
    let date = new Date();
    let embed = {
        color: bool ? 0x122334 : 0xfeeddc, // Ban || Unban
        timestamp: date,
        thumbnail: user.avatarURL({format: 'png', dynamic: true, size: 4096}),
        footer: {
            text: user.id,
            icon_url: user.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: `Member ${bool ? 'Banned' : 'Unbanned'}`,
            icon_url: user.avatarURL({format: 'png', dynamic: true, size: 4096})
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
        thumbnail: member.user.avatarURL({format: 'png', dynamic: true, size: 4096}),
        footer: {
            text: member.user.id,
            icon_url: member.user.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: `Member ${bool ? 'Joined' : 'Left'}`,
            icon_url: member.user.avatarURL({format: 'png', dynamic: true, size: 4096})
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
    //invite tracking
    if (config.modules.logging.invite){
        let invchannel = member.guild.channels.cache.get(config.modules.logging.invite);
        if (invchannel){
            //make sure to not error out because of insufficient permissions
            if (!member.guild.me.hasPermission('MANAGE_GUILD')){
                return invchannel.send(`I need \`Manage Server\` permission to analyze invites\nYou can disable this feature with \`${client.go[member.guild.id].config.customprefix || client.config.prefix}config logging invite reset\``);
            }
            let invites = await member.guild.fetchInvites();
            let changedInvites = invites.filter(inv => inv.uses > client.go[member.guild.id].invites.get(inv.code).uses);

            //analyze vanity URL data, but only if guild has it and when no other invites have changed
            let vanityData = new Object;
            if (member.guild.features.includes('VANITY_URL') && !changedInvites.size){
                vanityData = await member.guild.fetchVanityData();
                let existingVanityInvite = client.go[member.guild.id].invites.get(vanityData.code);
                if (vanityData.uses > existingVanityInvite.uses) changedInvites.set(vanityData.code, {
                    // inviterid: null,
                    code: vanityData.code,
                    uses: vanityData.uses,
                    deleted: false
                });
            }

            //defaulting message to error, changing when there's actual info
            let joinInformation = `I don't know how ${member.user} joined the server`;

            //taking any actions when there's at least one change invite that differs
            //I don't think there'll ever be an event of >1 invite changed, but even if, first change will be taken into account
            if (changedInvites.size){
                //updating invite in database and global cache
                let usedInvite = changedInvites.first();
                usedInvite = (await client.db.db(client.db.ops.invitedb).collection(member.guild.id).findOneAndUpdate({code: usedInvite.code}, { $set: {uses: usedInvite.uses} }, {returnOriginal: false})).value;
                client.go[member.guild.id].invites.set(usedInvite.code, usedInvite);

                //preparing end-user message
                joinInformation = `${member.user} used \`${usedInvite.code}\` - ${usedInvite.uses} invite uses`;
                if (usedInvite.inviterid){
                    let user = client.users.cache.get(usedInvite.inviterid);
                    if (!user) user = await require('../utils/apicalls').getDiscordUser(usedInvite.inviterid);
                    joinInformation += `\nInviter: ${user.tag} (${user.id})`;
                }
                else joinInformation += `\nThat seems to be vanity URL`;
            }

            //send output to end-users log channel
            invchannel.send(joinInformation);
        }
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
                    icon_url: message.author ? message.author.avatarURL({format: 'png', dynamic: true, size: 4096}) : null
                },
                author: {
                    name: `Message Deleted${message.author ? ` (msg age ${formatter.msToHuman(date.getTime() - message.createdTimestamp, 3)})` : ''}`,
                    icon_url: message.author ? message.author.avatarURL({format: 'png', dynamic: true, size: 4096}) : null
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
                    icon_url: newMessage.author.avatarURL({format: 'png', dynamic: true, size: 4096})
                },
                author: {
                    name: `Message Edited (msg age ${formatter.msToHuman(newMessage.editedTimestamp - (oldMessage.channel ? oldMessage.createdTimestamp : Date.parse(oldMessage.timestamp)), 3)})`,
                    icon_url: newMessage.author.avatarURL({format: 'png', dynamic: true, size: 4096})
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
                    icon_url: `${client.options.http.cdn}/avatars/${newUser.id}/${newUser.avatar}`
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
                    icon_url: newMember.user.avatarURL({format: 'png', dynamic: true, size: 4096})
                },
                author: {
                    name: `Nickname ${nickState}`
                },
                description: `${oldMember.nickname ? `Old: ${oldMember.nickname}` : ''}\n${newMember.nickname ? `New: ${newMember.nickname}` : ''}`.trim() || '*No data... That shouldn\'t happen, contact dev pls*'
            }});
        }
    }
}