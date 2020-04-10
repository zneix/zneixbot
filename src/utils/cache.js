exports.fetchGuildMembers = async function(client, guild){
    if (client.go[guild.id] ? !client.go[guild.id].fetchedMembers : false){
        await guild.members.fetch();
        if (!client.go[guild.id]) client.go[guild.id] = new Object;
        client.go[guild.id].fetchedMembers = true;
    }
}