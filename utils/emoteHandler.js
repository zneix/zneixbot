module.exports = client => {
    function dev(emoteName){
        let emote = client.guilds.get("288029287892910100").emojis.find(e => e.name === emoteName);
        return emote?emote:null;
    }
    function asset(emoteName){
        let emote = client.guilds.get("488443056799088640").emojis.find(e => e.name === emoteName);
        return emote?emote:null;
    }
    return {
        dev: dev,
        asset: asset
    }
}