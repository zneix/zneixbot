module.exports = async () => {
    await client.user.setPresence({
        status: 'dnd',
        activity: {
            name: `${client.config.prefix}help | ${client.users.cache.size} users online`,
            // url: '',
            type: 'PLAYING'
        }
    });
}