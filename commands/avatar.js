exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = "Links yours or someone's avatar. When no/wrong args are provided, links yours.";
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [user ID | @mention]`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        const {getUser} = require('../utils/rawApiRequests');
        if (!message.args.length) return await link(message.author);
        let taggedUser = message.mentions.users.first();
        if (!taggedUser){
            let validUser = client.users.get(message.args[0]);
            if (validUser) return await link(validUser);
            else {
                if (!/\d{17,}/.test(message.args[0])) return link(message.author); //saving bandwith for obvious non-snowflake values
                let puser = await getUser(client, message.args[0]);
                if (!puser) return link(message.author); //escape on wrong ID
                //successfull user fetch, preparing message author data on result object and sending it to result function
                puser.tag = `${puser.username}#${puser.discriminator}`;
                return await link(puser);
            }
        }
        else return await link(taggedUser);
        async function link(user){
            async function getFixedAvatar(user){
                if (!user.avatar) return null;
                let url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
                if ((await client.fetch(url.slice(0, -4))).headers.get('content-type')=='image/gif') url = url.slice(0, -3).concat('gif');
                return url+'?size=2048';
            }
            let avatarURL = await getFixedAvatar(user);
            if (!avatarURL) return {code: '26', msg: `User \`${user.tag}\` does not have an avatar`};
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
            message.channel.send(`<${avatarURL}>`, {embed:embed});
        }
    });
}