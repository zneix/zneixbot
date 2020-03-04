function logEmbed(client, embed){
    let logs = client.channels.cache.get(client.config.channels.logs);
    if (logs && !logs.permissionsFor(client.user).missing(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS']).length) logs.send({embed:embed});
    else console.log("[!logger] logs channel not found or I'm missing perms!"); //code executed as an error message
}
exports.ready = function(client){
    console.log(`{ready} Connected as: '${client.user.tag}'`);
    logEmbed(client, {
        color: 0xf97304,
        timestamp: client.readyAt,
        footer: {
            text: client.user.tag,
            icon_url: client.user.avatarURL({format:'png', 'dynamic':true})
        },
        author: {
            name: 'Logged in to WebSocket'
        },
        fields: [
            {
                name: 'User',
                value: `${client.user}\n${client.user.tag} \`${client.user.id}\``,
                inline: false
            },
            {
                name: 'Size',
                value: `Users: **${client.users.cache.size}**\nGuilds: **${client.guilds.cache.size}**\nChannels: **${client.channels.cache.size}**\nEmotes: **${client.emojis.cache.size}**`,
                inline: false
            }
        ]
    });
}
exports.command = function(message, cmd, level){
    console.log(`(cmd; level ${level}) ${cmd.name.replace(/{PREFIX}/, "")}`);
    logEmbed(message.client, {
        color: 0x0008ff,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
        },
        author: {
            name: "Command called"
        },
        description: `**User**: ${message.author} ${message.author.tag}\n**Channel**: ${message.channel} (${message.channel.name} : ${message.channel.id}) \n**Command**: ${cmd.name.replace(/{PREFIX}/, "")}\n**Arguments**: ${message.args.length?(message.content.slice(message.guild.prefix.length).trim().split(/[ \s]+/gm).slice(1).join(" ")):"N/A"}`
    });
}