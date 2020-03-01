module.exports = client => {
    function find(name){
        let emote = client.emojis.find(e => e.name == name);
        return emote ? emote : `\`:${name}:\``;
    }
    function guild(alias, name){
        let emote = client.guilds.get(client.config.guilds[alias]).emojis.find(e => e.name == name);
        return emote ? emote : `\`:${name}:\``;
    }
    function id(eid){
        let emote = client.emojis.get(eid);
        return emote ? emote : `\`:${name}:\``;
    }
    function sanit(str){
        return str.replace(/<a?:([a-z0-9-_]+):\d+>/gi, '$1');
    }
    function detect(str){
        const regex = /<a?:([a-z0-9-_]+):(\d+)>/gi;
        let emotes = [];
        let m;

        while ((m = regex.exec(str)) !== null){
            if (m.index === regex.lastIndex) regex.lastIndex++;
            emotes.push({
                name: m[1],
                animated: m[0].startsWith('<a:'),
                clienthas: client.emojis.has(),
                start: m.index,
                end: m.index+m[0].length
            });
        }
        return emotes;
    }
    return {
        find: find,
        guild: guild,
        id: id,
        sanit: sanit,
        detect: detect
    }
}