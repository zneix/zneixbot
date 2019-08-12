module.exports = client => {
    client.user.setPresence({
        status: 'dnd',
        game: {
            // name: client.config.prefix+`help, ver: `+client.version,
            name: `${client.config.prefix}help, v${client.version}`,
            url: `https://www.twitch.tv/zneix`,
            type: 1
        }
    });
    client.logger.ready();
}