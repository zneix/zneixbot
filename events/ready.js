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
    const logger = require('../utils/logger')(client);
    logger.ready(client);
}