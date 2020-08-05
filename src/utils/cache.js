exports.fetchGuildMembers = async function(guild){
    if (client.go[guild.id] ? !client.go[guild.id].fetchedMembers : false){
        await guild.members.fetch();
        if (!client.go[guild.id]) client.go[guild.id] = new Object;
        client.go[guild.id].fetchedMembers = true;
    }
}
exports.getUserFromMessage = async function(message, { useQuery, withinGuild } = {}){
    if (!message.args.length) return message.author;
    //message @mention of a user (usually (if not only) of a guild member)
    let mentionedUser = message.mentions.users.first();
    if (mentionedUser) return mentionedUser;
    //userID of someone, who's sharing a server with the bot
    if (client.users.cache.get(message.args[0])) return client.users.cache.get(message.args[0]);
    //getting user via exact user.tag (e.g. zneix#4433)
    let userFromTag = withinGuild
    ? message.guild.members.find(member => member.user.tag.toLowerCase() == message.args[0].toLowerCase())
    : client.users.cache.find(user => user.tag.toLowerCase() == message.args[0].toLowerCase());
    if (userFromTag) return userFromTag;
    //in servers, looking up guild members
    if (message.guild && useQuery){
        let queryResult = await message.guild.members.fetch({query: message.args.join(' '), limit: 1});
        if (queryResult.size) return queryResult.first().user;
    }
    //calling Discord API
    //saving API calls for obvious non-snowflake values
    if (/\d{17,}/.test(message.args[0]) && !withinGuild){
        const partialUser = await require('./apicalls').getDiscordUser(message.args[0]);
        if (partialUser) return partialUser;
    }
    //nothing relevant found
    return null;
}