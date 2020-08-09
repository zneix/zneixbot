exports.description = 'Displays various information about user - @mention them or provide their ID. Command without arguments outputs information about you.';
exports.usage = '[user ID | @mention]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 4000;
exports.dmable = true;

exports.run = async message => {
    const formatter = require('../src/utils/formatter');
    let user = await require('../src/utils/cache').getUserFromMessage(message, {useQuery: true});
    if (!user) throw ['normal', 'No user found! @Mention someone, use user ID, username or user tag (like zneix#4433).'];

    let member = message.guild ? message.guild.members.cache.get(user.id) : null;
    let avatarURL = user.avatarURL({format: 'png', dynamic: true, size: 4096});
    let embed = {
        color: 0x2f3136,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: user.tag,
            icon_url: avatarURL
        },
        thumbnail: {
            url: avatarURL
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
                name: 'Created at',
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
                value: `#${parseInt(embed.color).toString(16).padStart(6, '0')}`,
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
                value: memberPerms.includes('**Administrator**') ? '**Administrator** (all permissions)' : memberPerms.join(', '),
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
            return null;
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