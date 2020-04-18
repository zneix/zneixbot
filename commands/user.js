exports.description = 'Displays various information about user - @mention them or provide their ID. Command without arguments outputs information about you.';
exports.usage = '[user ID | @mention]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    const formatter = require('../src/utils/formatter');
    if (!message.args.length) return result(message.author);
    let mentionedUser = message.mentions.users.first();
    if (mentionedUser) return result(mentionedUser); //mention
    else {
        let validUser = client.users.cache.get(message.args[0]);
        if (validUser) return result(validUser); //userID
        else {
            if (!/\d{17,}/.test(message.args[0])) return result(message.author); //saving bandwith for obvious non-snowflake values
            const {getDiscordUser} = require('../src/utils/apicalls');
            let puser = await getDiscordUser(message.args[0]);
            if (!puser) return result(message.author); //escape on wrong ID
            //successfull user fetch, preparing message author data on result object and sending it to result function
            puser.avatarURL = await getFixedAvatar(puser);
            return result(puser, true);
            async function getFixedAvatar(user){
                if (!user.avatar) return null;
                let url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
                const fetch = require('node-fetch');
                if ((await fetch(url.slice(0, -4))).headers.get('content-type') == 'image/gif') url = url.slice(0, -3).concat('gif');
                return url;
            }
        }
    }
    async function result(user, boolApi){
        let member = message.guild ? message.guild.members.cache.get(user.id) : null;
        let embed = {
            color: 0x2f3136,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
            },
            author: {
                name: user.tag,
                icon_url: boolApi ? user.avatarURL : user.avatarURL({format:'png', 'dynamic':true})
            },
            thumbnail: {
                url: boolApi ? user.avatarURL : user.avatarURL({format:'png', 'dynamic':true})
            },
            //messy workaround below to support handling 'foreign users'
            description: `${user.bot ? client.emoteHandler.guild('dbots', 'botTag') : ''}<@${user.id}> ${user.presence ? `${user.presence.status} ${client.emoteHandler.guild('dbots', `${user.presence.status.replace('idle', 'away')}2`).toString()}` : ''}`,
            fields: [
                {
                    name: 'User ID',
                    value: user.id,
                    inline: false
                },
                {
                    name: "Created at",
                    value: `${formatter.dateFormat(user.createdAt)}, ${formatter.hourFormat(user.createdAt)}\n\`${formatter.msToHuman(message.createdAt - user.createdTimestamp, 3)} ago\``,
                    inline: true
                }
            ]
        }
        //appending destkop / mobile indicator
        if (user.presence ? user.presence.clientStatus : false) embed.description += `${user.presence.clientStatus.desktop ? ' 🖥' : ''}${user.presence.clientStatus.mobile ? ' 📱' : ''}${user.presence.clientStatus.web ? ' 🌐' : ''}`;
        if (member){
            await require('../src/utils/cache').fetchGuildMembers(message.guild);
            let joinPos = [...message.guild.members.cache.sort((a, b) => a.joinedAt - b.joinedAt).keys()].indexOf(member.user.id)+1;
            embed.fields.push({
                name: 'Joined at',
                value: `${formatter.dateFormat(member.joinedAt)}, ${formatter.hourFormat(member.joinedAt)}\n\`${formatter.msToHuman(message.createdAt - member.joinedTimestamp, 3)} ago\`\n(**${joinPos}${formatter.numSuffix(joinPos)}** to join)`,
                inline: true
            });
            let roles = member.roles.cache.filter(r => r.id != message.guild.id).map(r => r.toString()); //roles thingy
            if (roles.length){
                embed.fields.push({
                    name: `Roles [${roles.length}]`,
                    value: (roles.join(' ').length < 1023) ? roles.join(' ') : (roles.join(' ').substr(0, 1012) + '\n[truncated]'),
                    inline: false
                });
            }
            if (member.displayColor){
                embed.color = member.displayColor >= 16777215 ? member.displayColor-- : member.displayColor;
                embed.fields.push({
                    name: 'Color',
                    value: `#${'0'.repeat(6 - parseInt(embed.color).toString(16).length)}${parseInt(embed.color).toString(16)}`,
                    inline: true
                });
            }
            let spotify = member.presence.activities.filter(x => x.name == 'Spotify' && x.type == 'LISTENING')[0];
            if (spotify){
                embed.fields.push({
                    name: 'Spotify',
                    value: `${spotify.details} by ${spotify.state} (${formatter.msToHuman(Date.now() - spotify.timestamps.start, 2)} / ${formatter.msToHuman(spotify.timestamps.end - spotify.timestamps.start, 2)})`,
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
                let memberPerms = modPerms.filter(x => member.permissions.toArray().includes(x)).map(mPerm => modPermsObj[mPerm]);
                embed.fields.push({
                    name: 'Moderator Permissions',
                    value: memberPerms.includes('**Administrator**') ? '**Administrator**' : memberPerms.join(', '),
                    inline: false
                });
            }
            //Server Acknowledgements
            let Acknowledge = function(){
                if (client.perms.isGod(member.id)) return `${client.emoteHandler.guild('asset', 'staff')} Developer of zneixbot`;
                if (client.perms.getUserLvl(member.id) >= client.perms.levels.mod) return `${client.emoteHandler.guild('asset', 'supermod')} Member of zneixbot team`;
                if (member.id == client.user.id) return `${client.emoteHandler.guild('asset', 'MrDestructoid')} The real zneixbot`;
                if (member.guild.ownerID == member.id) return `${client.emoteHandler.guild('asset', 'broadcaster')} Server Owner`;
                if (member.permissions.has('ADMINISTRATOR')) return `${client.emoteHandler.guild('asset', 'mod')} Server Administrator`;
                return false;
            }
            if (Acknowledge()){
                embed.fields.push({
                    name: 'Acknowledgements',
                    value: Acknowledge(),
                    inline: false
                });
            }
        }
        message.channel.send({embed:embed});
    }
}