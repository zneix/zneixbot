let base = 'https://discordapp.com/api';

exports.getUser = async function(client, id){
    //custom query getting partial user profile, used by commands like user.js, avatar.js, etc...
    let response = await client.fetch(`${base}/users/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bot ${client.token}` }
    }).then(d => d.json());
    if (!response.id) return null; //escape on wrong user (all valid users should have their ID field returned)
    //hard fix for non-bot users
    if (!response.bot) response.bot = false;
    return response;
}