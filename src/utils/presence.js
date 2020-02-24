module.exports = client => {
    client.user.setPresence({
        status: 'dnd',
        game: {
            name: `${client.config.prefix}help | ${client.guilds.size} servers`,
            // url: '',
            type: 'PLAYING'
        }
    });
}