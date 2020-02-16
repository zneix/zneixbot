exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = "Looks up and posts a random gachimuchi video. Note that some videos might be taken down already.\nAvailable **only** in NSFW channels!";
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        if (!message.channel.nsfw && !message.perms.isOwner()) message.channel.send(`This command is only available in NSFW channels, leatherman ${client.emoteHandler.guild('asset', 'pajaVan')}`);
        else {
            let m = await message.channel.send('Looking up some dank gachi videos...');
            //pinging supinic's API
            let r = await client.fetch('https://supinic.com/api/gachi/list').then(r => r.json());
            let rg = r.list[Math.floor(Math.random() * r.list.length)];
            //posting response
            let str = `Random gachi video #${rg.ID} - ${rg.name}\n${rg.link}`
            if (rg.alternateLink) str += `\nAlternative link: <${rg.alternateLink}>`;
            str += `\nContributed by: **${rg.addedBy}**`
            +`\nPublished on: ${rg.published}`;
            !message.channel.messages.get(m.id) ? message.channel.send(str) : m.edit(str);
        }
    });
}