exports.description = 'Provides information about specific role.';
exports.usage = '<@Role | roleID>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    let role = require('../src/utils/cache').getRoleFromMessage(message, {useQuery: true});
    if (!role) throw ['normal', 'No relevant roles found! @Mention the role, use role ID or provide role name.'];

    const {dateFormat, hourFormat, msToHuman, numSuffix} = require('../src/utils/formatter');
    // let joinPos = [...message.guild.members.cache.sort((a, b) => a.joinedAt - b.joinedAt).keys()].indexOf(member.user.id)+1;
    let rolePos = message.guild.roles.cache.size - role.position;
    let messageOptions =  {
        embed: {
            color: role.color || 0x2f3136,
            timestamp: role.createdTimestamp,
            footer: {
                text: `ID: ${role.id} | Created:`
            },
            thumbnail: {
                url: 'attachment://color.png'
            },
            author: {
                name: role.name
            },
            fields: [
                {
                    name: 'Hoisted',
                    value: `${role.hoist ? 'Yes' : 'No'} ${client.emoteHandler.guild('asset', role.hoist ? 'tickyes' : 'tickno')}`,
                    inline: true
                },
                {
                    name: 'Mentionable',
                    value: `${role.mentionable ? 'Yes' : 'No'} ${client.emoteHandler.guild('asset', role.mentionable ? 'tickyes' : 'tickno')}`,
                    inline: true
                },
                {
                    name: 'Managed',
                    value: `${role.managed ? 'Yes' : 'No'} ${client.emoteHandler.guild('asset', role.managed ? 'tickyes' : 'tickno')}`,
                    inline: true
                },
                {
                    name: 'Created at',
                    value: `${dateFormat(role.createdAt)}, ${hourFormat(role.createdAt)}\n\`${msToHuman(message.createdAt - role.createdTimestamp, 3)} ago\``,
                    inline: false
                },
                {
                    name: 'Position',
                    value: `${role.position} (${rolePos}${numSuffix(rolePos)} from top)`,
                    inline: true
                },
                {
                    name: 'Role members',
                    value: role.members.size,
                    inline: true
                }
            ]
        },
        files: new Array
    };
    if (role.color != 0){
        //generating thumbnail with role color (only if it's not equal 0 - that's a default role color, which is 'transparent')
        const {createCanvas} = require('canvas');
        let canvas = createCanvas(60, 60);
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = role.hexColor;
        ctx.fillRect(0, 0, 60, 60);
        //append immage to message.attachments in messageOptions object
        messageOptions.files.push({
            name: 'color.png',
            attachment: canvas.toBuffer()
        });
        //also append a field with color
        messageOptions.embed.fields.push({
            name: 'Color',
            value: role.hexColor,
            inline: false
        });
    }
    message.channel.send(messageOptions);
}