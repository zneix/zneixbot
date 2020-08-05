const fetch = require('node-fetch');
const baseDiscord = 'https://discordapp.com/api';
const agent = 'zneixbot project: https://github.com/zneix/zneixbot';
const formatter = require('./formatter');
//custom query getting partial user profile, used by commands like user.js, avatar.js, etc...
exports.getDiscordUser = async function(id){
    let response = await fetch(`${baseDiscord}/users/${id}`, {
        method: 'GET',
        headers: { 'User-Agent': agent, Authorization: `Bot ${client.token}` }
    }).then(c => c.json());
    if (!response.id) return null; //escape on wrong user (all valid users should have their ID field returned)

    //hard fix for non-bot users
    if (!response.bot) response.bot = false;
    response.tag = `${response.username}#${response.discriminator}`;
    response.createdTimestamp = formatter.snowflake(response.id).timestamp;
    response.createdAt = new Date(response.createdTimestamp);

    //avatarURL with properties: dynamic, max res
    response.avatarURL = function({ size } = {}){
        return `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.${/^a_/.test(response.avatar) ? 'gif' : 'png'}${size ? `?size=${size}` : ''}`;
    }

    return response;
}
//custom query for getting statistics about a single guild invite
exports.getDiscordInvite = async function(code){
    let response = await fetch(`${baseDiscord}/invites/${code}?with_counts=true`, {
        method: 'GET',
        headers: { 'User-Agent': agent }
    }).then(c => c.json());
    if (!response.guild) return null;

    //fixing some properties for guild object
    response.guild.createdTimestamp = formatter.snowflake(response.guild.id).timestamp;
    response.guild.createdAt = new Date(response.guild.createdTimestamp);

    //fixing some properties for channel object
    response.channel.createdTimestamp = formatter.snowflake(response.channel.id).timestamp;
    response.channel.createdAt = new Date(response.channel.createdTimestamp);

    //fixing some properties for inviter object, just like in getDiscordUser
    if (response.inviter){
        if (!response.inviter.bot) response.inviter.bot = false;
        response.inviter.tag = `${response.inviter.username}#${response.inviter.discriminator}`;
        response.inviter.createdTimestamp = formatter.snowflake(response.inviter.id).timestamp;
        response.inviter.createdAt = new Date(response.inviter.createdTimestamp);
    }

    return response;
}