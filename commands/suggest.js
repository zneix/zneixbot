exports.description = 'Suggest new stuff, report a bug or message devs.'
+'\nBot will notify you once devs review your suggestion.'
+'\nRemember, that abusing command may result in being banned from it.'
+'\nYou can also go to my github page and open an issue there: https://github.com/zneix/zneixbot/issues';
exports.usage = '<suggestion>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 10000;
exports.dmable = true;

exports.run = async message => {
    if (!message.attachments.size && !message.args.length) throw ['normal', 'You can use this to suggest new stuff, report a bug or message devs.\nInclude your message and bot will let you know once devs have reviewed your request.'];
    else {
        let text = message.args.join(' ');
        let links = null;
        if (message.attachments.size){
            links = message.attachments.map(att => att.url);
            text += ' || Attachemnts: '+links.join('\n');
        }
        let sid = await client.db.utils.getAutoincrement('suggestions');
        client.db.utils.insert('suggestions', [{
            id: sid,
            user: {
                id: message.author.id,
                tag: message.author.tag
            },
            text: text,
            status: 'new', //can be: new, dismissed, approved, completed, spam (not-a-suggestion)
            notes: '',
            updates: []
        }]).catch(err => {message.channel.send(`Something went wrong, contact zneix#4433 (suggestion error ID ${sid})`); throw err})
        .then(() => {
            message.channel.send(`Suggestion saved, I will let you know once devs review it. (ID ${sid})`);
            let feedback = client.channels.cache.get(client.config.channels.feedback);
            if (feedback){
                let embed = {
                    color: 0x79fcb2,
                    timestamp: message.createdAt,
                    footer: {
                        text: message.author.tag,
                        icon_url: message.author.avatarURL({format:'png', 'dynamic':true})
                    },
                    author: {
                        name: `New Suggestion! ID: ${sid}`,
                        url: message.url
                    },
                    description: `\`Author:\` ${message.author} ${message.author.tag} (${message.author.id})`
                    +`\n\`Text:\` ${text}`,
                }
                feedback.send({embed:embed});
            }
        });
    }
}