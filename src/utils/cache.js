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
    let userFromID = client.users.cache.get(message.args[0]);
    if (userFromID) return userFromID;
    //getting user via exact user.tag (e.g. zneix#4433)
    //decided to put that under query, since that uses strings from user input, which may not be 100% correct at all times
    if (useQuery){
        let userFromTag = withinGuild
        ? message.guild.members.cache.find(member => member.user.tag.toLowerCase() == message.args[0].toLowerCase() || member.user.tag.toLowerCase() == message.args.join(' ').toLowerCase())
        : client.users.cache.find(user => user.tag.toLowerCase() == message.args[0].toLowerCase() || user.tag.toLowerCase() == message.args.join(' ').toLowerCase());
        let Discord = require('discord.js');
        if (userFromTag) return userFromTag instanceof Discord.GuildMember ? userFromTag.user : userFromTag;
    }
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
exports.getRoleFromMessage = function(message, { useQuery } = {}){
    //role @mention
    let mentionedRole = message.mentions.roles.first();
    if (mentionedRole) return mentionedRole;
    //roleID
    let roleFromID = message.guild.roles.cache.get(message.args[0]);
    if (roleFromID) return roleFromID;
    if (useQuery){
        //fuzzy search if previous methods didn't work (also filtering out default server role)
        const Fuse = require('fuse.js');
        let fuse = new Fuse(message.guild.roles.cache.filter(r => r.position != 0).map(r => {
            return {
                name: r.name,
                id: r.id
            }
        }), {
            keys: ['name']
        });
        let res = fuse.search(message.args.join(' '));
        if (res[0]) return message.guild.roles.cache.get(res[0].item.id);
    }
    return null;
}