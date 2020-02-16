exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Displays general information about the bot.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let shell = require('child_process');
        let {msFormat} = require('../utils/timeFormatter');
        let msg = await message.channel.send('Fetching data...');
        //getting commit informations
        let lastCommit = (await client.fetch('https://api.github.com/repos/zneix/zneixbot/git/refs/heads/master').then(d => d.json())).object.sha;
        let runningCommit = shell.execSync('git show --format="%H %at" --summary -q').toString().trim().split(/\s/g); //commit hash, commit timestamp
        let runningNumber = (await client.fetch(`https://api.github.com/repos/zneix/zneixbot/compare/a0cd321c1e542492fa750bda65f1c52a03f6532f...${runningCommit[0]}`).then(d => d.json())).total_commits;
        //formatting it and editing
        let embed = {
            color: 0xf97304,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            description: `
Commands loaded: **${client.commands.size}**
Running commit: **#${runningNumber+1} [${runningCommit[0].substr(0, 7)}](https://github.com/zneix/zneixbot/commit/${runningCommit[0]})${(runningCommit[0]==lastCommit)?' [Latest]':''}** \`${msFormat(message.createdAt - parseInt(runningCommit[1])*1000)} ago\`

**✨ [Invite me to your server!](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)
${client.emoteHandler.guild('asset', 'githublogo')} [Code on GitHub](https://github.com/zneix/zneixbot)
${client.emoteHandler.guild('asset', 'discordlogo')} [Support & Community sevrer](https://discord.gg/3UZ5624)**
`
        }
        msg.edit({embed:embed});
    });
}