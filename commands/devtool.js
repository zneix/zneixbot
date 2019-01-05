module.exports = {
    name: "devtool",
    description: "This is a developer tool, do not use it",
    execute(message) {
        message.channel.send(`test\n${message.content}`);
    },

}