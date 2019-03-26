module.exports = {
    name: `zneix`,
    description: `my dev OwO`,
    execute(message, config) {
        message.channel.send(`${message.author.username}, <@!${config.devid}> is ded!`)
    },
};