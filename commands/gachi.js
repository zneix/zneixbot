exports.description = "Looks up and posts a random gachimuchi video. Note that some videos might be taken down already.\nAvailable **only** in NSFW channels!\nPowered by supinic.com";
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 7000;
exports.dmable = false;

exports.run = async message => {
    const fetch = require('node-fetch');
    if (!message.channel.nsfw && !client.perms.isGod(message.author.id)) message.channel.send(`This command is only available in NSFW channels, leatherman ${client.emoteHandler.guild('asset', 'pajaVan')}`);
    else {
        let m = await message.channel.send('Looking up some dank gachi videos...');
        //pinging supinic's API
        let r = await fetch('https://supinic.com/api/gachi/list').then(r => r.json()).catch(err => {throw err;}); //errors should occur only in cases when supinic's api doesn't work or something
        let rg = r.list[Math.floor(Math.random() * r.list.length)];
        //posting response
        let str = `Random gachi video #${rg.ID} - ${rg.name}\n${rg.link}`
        if (rg.alternateLink) str += `\nAlternative link: <${rg.alternateLink}>`;
        str += `\nContributed by: **${rg.addedBy}**`
        +`\nPublished on: ${rg.published}`;
        m.deleted ? message.channel.send(str) : m.edit(str);
    }
}