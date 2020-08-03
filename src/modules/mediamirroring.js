module.exports = async message => {
    //1. Check if message has attachments
    //2. Check for guild's config - if there's logging.mediamirror
    //3. Check if mediamirror channel exists
    if (!message.attachments.size) return;
    let mirrorChannelID = client.go[message.guild.id].config.modules.logging.mediamirror;
    if (!mirrorChannelID) return;
    let mirrorChannel = message.guild.channels.cache.get(mirrorChannelID);
    if (!mirrorChannel) return;

    //do stuff
    //first, fetch link with media and turn it into a buffer
    //limitting fetches to 25MB max to not overload my very small server
    const fetch = require('node-fetch');
    let mirroredMedia = await Promise.all([...message.attachments.keys()]
    .filter(x => message.attachments.get(x).size <= 26214399).map(async key => {
        return {
            buffer: await fetch(message.attachments.get(key).url).then(r => r.buffer()),
            name: message.attachments.get(key).name
        }
    }));
    if (!mirroredMedia.length) return;
    let embed = {
        color: 0x2f3136,
        description: `Mirrored media of [this](${message.url})\nChannel ID: ${message.channel.id}\nMessage ID: ${message.id}`
    }
    let mirrorMessage = await mirrorChannel.send({embed: embed, files: mirroredMedia.map(media => { return {attachment: media.buffer, name: `mirrored_${media.name}`} })});
    client.db.utils.insert('mirroredmedia', [{
        messageid: message.id,
        // messageURL: message.url, //I think we don't need this, but may be helpful if we wanna make some kind of reverse search
        mirrorMessageURL: mirrorMessage.url
    }]);
}