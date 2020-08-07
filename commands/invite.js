exports.description = 'Invite zneixbot to your server!';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    let perms = 1409674343; //permission bitfield
    message.channel.send({embed:{
        color: 0xf97304,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        description: `${client.emoteHandler.guild('asset', 'MrDestructoid')} [Invite zneixbot to your server](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${perms}&scope=bot)`
        +`\n${client.emoteHandler.guild('asset', 'discordlogo')} [Support Server Invite](https://discordapp.com/invite/cF555AV)`
    }});
}