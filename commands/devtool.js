module.exports = {
    name: "devtool",
    description: "This is a developer tool, do not use it",
    execute(message, config) {
        if (message.author.id != 288028423031357441) {
        message.channel.send(`This is a developer tool, you're not allowed to use it!`);
        } else {
            message.channel.send(`You're epic!`);
        }
    },

}