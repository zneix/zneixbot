module.exports = {
    name: `gachi`,
    description: `we all belive PepeHands`,
    execute(message) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => {
            const dispatcher = connection.playFile('./media/gachi.mp3');
            message.channel.send('**I believe PepeHands!**')
            .then(() => console.log('playing gachi!'));
            dispatcher.on('end', () => {
            // The song has finished
            message.member.voiceChannel.join()
                .then(connection => {
                    message.member.voiceChannel.leave();
                    message.channel.send(`We all belived in ${message.member.voiceChannel}!`);
                })
            });
            }).catch(console.error);
    } else {
        message.channel.send(`You do not belive **( ͡° ͜ʖ ͡°)**`);
        }
    },
};