module.exports = client => {
    console.log(`[ready] Connected as: '${client.user.tag}'`);
    client.user.setPresence({
        status: 'dnd',
        game: {
            // name: client.config.prefix+`help, ver: `+client.version,
            name: `🦀G🦀R🦀I🦀X🦀\n🦀G🦀O🦀N🦀E🦀`,
            url: `https://www.twitch.tv/zneix`,
            type: 1
        }
    });
}