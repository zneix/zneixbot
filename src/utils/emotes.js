exports.find = (name) => {
    let emote = client.emojis.cache.find(e => e.name == name);
    return emote ? emote : `\`:${name}:\``;
}
exports.guild = (alias, name) => {
    let guild = client.guilds.cache.get(client.config.guilds[alias]);
    let emote;
    if (guild) emote = guild.emojis.cache.find(e => e.name == name);
    return emote ? emote : `\`:${name}:\``;
}
exports.id = (eid) => {
    let emote = client.emojis.cache.cache.get(eid);
    return emote ? emote : `\`:${name}:\``;
}
exports.sanit = (str) => {
    return str.replace(/<a?:([a-z0-9-_]+):\d+>/gi, '$1');
}
exports.detect = (str) => {
    const regex = /<a?:([a-z0-9-_]+):(\d+)>/gi;
    let emotes = [];
    let m;

    while ((m = regex.exec(str)) !== null){
        if (m.index === regex.lastIndex) regex.lastIndex++;
        emotes.push({
            name: m[1],
            animated: m[0].startsWith('<a:'),
            clienthas: client.emojis.cache.has(),
            start: m.index,
            end: m.index+m[0].length
        });
    }
    return emotes;
}