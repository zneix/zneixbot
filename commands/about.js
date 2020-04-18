exports.description = 'Displays some basic informations about the bot.';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 7500;
exports.dmable = true;

exports.run = async message => {
    const shell = require('child_process');
    const fetch = require('node-fetch');
    let {msToHuman} = require('../src/utils/formatter');
    let msg = await message.channel.send('Fetching data...');
    //getting commit informations
    // let lastCommit = (await fetch('https://api.github.com/repos/zneix/zneixbot/git/refs/heads/master').then(d => d.json())).object.sha;
    let runningCommit = shell.execSync('git show --format="%h %at" --summary -q').toString().trim().split(/\s/g); //commit hash, commit timestamp
    let runningNumber = (await fetch(`https://api.github.com/repos/zneix/zneixbot/compare/a0cd321...${runningCommit[0]}`).then(d => d.json())).total_commits;
    let branchInfo = shell.execSync('git status').toString().trim();

    //bot database stats
    const suggestionCount = await client.db.db().collection('suggestions').countDocuments();
    const errorCount = await client.db.db().collection('errors').countDocuments();
    //formatting it and editing
    let embed = {
        color: 0xf97304,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
        },
        description: `
Running commit: **#${runningNumber+1} [${runningCommit[0]}](https://github.com/zneix/zneixbot/commit/${runningCommit[0]})${Boolean(branchInfo.match(/Your branch is up to date/)) ? ' [Latest]' : ''}** \`${msToHuman(message.createdAt - parseInt(runningCommit[1])*1000, 3)} ago\`
Code branch: **${branchInfo.match(/On branch (.+)/)[1]}**
Commands loaded: **${client.commands.size}**
Suggestions saved: **${suggestionCount}**
Errors caught: **${errorCount}**
Developer: **${client.users.cache.get('288028423031357441').tag}**
OS: **${process.platform}**
**✨ [Invite me to your server!](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)
${client.emoteHandler.guild('asset', 'githublogo')} [Code on GitHub](https://github.com/zneix/zneixbot)
${client.emoteHandler.guild('asset', 'discordlogo')} [Support & Community server](https://discord.gg/3UZ5624)**`
    }
    if (!msg.deleted) msg.edit({embed:embed});
    else message.channel.send({embed:embed});
}