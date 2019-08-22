module.exports = client => {
    function find(emoteName){
        let emote = client.emojis.find(e => e.name === emoteName);
        return emote?emote:null;
    }
    function id(emoteID){
        let emote = client.emojis.get(emoteID);
        return emote?emote:null;
    }
    function dev(emoteName){
        let emote = client.guilds.get("288029287892910100").emojis.find(e => e.name === emoteName);
        return emote?emote:null;
    }
    function asset(emoteName){
        let emote = client.guilds.get("488443056799088640").emojis.find(e => e.name === emoteName);
        return emote?emote:null;
    }
    return {
        find: find,
        id: id,
        dev: dev,
        asset: asset
    }
}