module.exports = client => {
    let ready = function(){
        console.log(`[ready] Connected as: '${client.user.tag}'`);
        let logs = client.channels.get(client.config.channels.logs);
        if (logs) {
            var embed = {
                color: 0xf97304,
                timestamp: new Date(),
                footer: {
                    text: client.user.tag,
                    icon_url: client.user.avatarURL
                },
                author: {
                    name: "Logged in to WebSocket"
                },
                fields: [
                    {
                        name: "User",
                        value: client.user+"\n"+client.user.tag+" `"+client.user.id+"`",
                        inline: false
                    },
                    {
                        name: "Size",
                        value: `Users: **${client.users.size}**\nGuilds: **${client.guilds.size}**\nChannels: **${client.channels.size}**\nEmotes: **${client.emojis.size}**`,
                        inline: false
                    }
                ]
            }
            logs.send({embed:embed});
        }
        else console.log(`[!ready] logs channel not found!`); //code executed as an error message
    }
    let command = function(message, cmd, level){
        console.log(`(cmd; level ${level}) ${cmd.name.replace(/{PREFIX}/, "")}`);
        let logs = client.channels.get(client.config.channels.logs);
        if (logs) {
            var embed = {
                color: 0x0008ff,
                timestamp: new Date(),
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                author: {
                    name: "Command successfully executed"
                },
                description: `${message.author} in ${message.channel} \n**Command**: ${cmd.name.replace(/{PREFIX}/, "")}\n**Arguments**: ${message.args.length?message.args.join(" "):"N/A"}`
            }
            logs.send({embed:embed});
        }
        else console.log(`(!cmd) logs channel not found!`);
    }
    return {
        ready: ready,
        command: command
    }
}