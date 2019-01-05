module.exports = {
    name: 'tagme',
    description: 'tags user',
    execute(message) {
        message.channel.send(`hOi, ${message.author}!`);
    },
};