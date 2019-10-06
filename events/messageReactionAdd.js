module.exports = async (client, reaction, user) => {
    client.RCHandler.handle(reaction, user);
}