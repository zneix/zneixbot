module.exports = () => {
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: `I was updated recently! Check ${client.config.prefix}changelog`,
            // url: '',
            type: 'PLAYING'
        }
    });
}