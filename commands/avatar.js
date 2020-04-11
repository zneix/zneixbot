exports.description = "Links yours or someone's avatar. When no/wrong args are provided, links yours.";
exports.usage = '[user ID | @mention]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.pipeable = false;

exports.run = async message => {
    const {getDiscordUser} = require('../src/utils/apicalls');
    if (!message.args.length) return await link(message.author);
    let mentionedUser = message.mentions.users.first();
    if (!mentionedUser){
        let validUser = client.users.cache.get(message.args[0]);
        if (validUser) return await link(validUser);
        else {
            if (!/\d{17,}/.test(message.args[0])) return link(message.author, true); //saving bandwith for obvious non-snowflake values
            let puser = await getDiscordUser(message.args[0]); //puser - Partial User (just a few basic informations)
            if (!puser) return link(message.author, true); //escape on wrong ID
            //successfull user fetch, preparing message author data on result object and sending it to result function
            return await link(puser);
        }
    }
    else return await link(mentionedUser);
    async function link(user, wasError){
        async function getFixedAvatar(user){
            if (!user.avatar) return null;
            let url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
            let fetch = require('node-fetch');
            if ((await fetch(url.slice(0, -4))).headers.get('content-type') == 'image/gif') url = url.slice(0, -3).concat('gif');
            return `${url}?size=2048`;
        }
        let avatarURL = await getFixedAvatar(user);
        if (!avatarURL) throw ['normal', `User \`${user.tag}\` does not have an avatar`];
        let embed = {
            color: 0x852442,
            timestamp: message.createdAt,
            footer: {
                text: "Avatar of "+user.tag,
                icon_url: avatarURL
            },
            author: {
                name: `Avatar of ${user.tag}`,
                url: avatarURL
            },
            image: {
                url: avatarURL
            }
        }
        message.channel.send(`${wasError ? 'Invalid ID provided, showing your avatar instead\n' : ''}<${avatarURL}>`, {embed:embed});
    }
}