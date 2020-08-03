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
    const fetch = require('node-fetch');
    let mirroredMedia = await Promise.all([...message.attachments.keys()].map(async key => {
        return {
            buffer: await fetch(message.attachments.get(key).url).then(r => r.buffer()),
            name: message.attachments.get(key).name
        }
    }));
    let embed = {
        color: 0x2f3136,
        description: `Mirrored media of [this](${message.url})\nChannel ID: ${message.channel.id}\nMessage ID: ${message.id}`
    }
    let mirrorMessage = await mirrorChannel.send({embed: embed, files: mirroredMedia.map(media => { return {attachment: media.buffer, name: `mirrored_${media.name}`} })});
}