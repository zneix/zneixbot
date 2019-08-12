module.exports = client => {
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
        command: command
    }
}