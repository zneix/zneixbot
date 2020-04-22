module.exports = () => {
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: 'https://ponyvilleplaza.com/',
            // url: '',
            type: 'PLAYING'
        }
    });
}