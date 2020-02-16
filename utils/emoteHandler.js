module.exports = client => {
    function find(emoteName){
        let emote = client.emojis.find(e => e.name === emoteName);
        return emote?emote:"`:"+emoteName+":`";
    }
    function id(emoteID){
        let emote = client.emojis.get(emoteID);
        return emote?emote:"`:"+emoteName+":`";
    }
    function guild(guildAlias, emoteName){
        if (!client.config.guilds[guildAlias]) return `\`:${emoteName}:\``;
        let emote = client.guilds.get(client.config.guilds[guildAlias]).emojis.find(e => e.name == emoteName);
        return emote ? emote : `\`:${emoteName}:\``;
    }
    return {
        find: find,
        id: id,
        guild: guild
    }
}