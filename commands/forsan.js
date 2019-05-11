module.exports = {
    name: `forsan`,
    description: `plays forsan`,
    execute(message) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => {
            const dispatcher = connection.playFile('./media/forsan.mp3');
            message.channel.send('**:Pepega: :mega: FORSAAAN!**')
            .then(() => console.log('playing forsan!'));
            dispatcher.on('end', () => {
            // The song has finished
            message.member.voiceChannel.join()
                .then(connection => {
                    message.member.voiceChannel.leave();
                    message.channel.send(`I am transparent now forsenCD (${message.member.voiceChannel})`);
                })
            });
            }).catch(console.error);
    } else {
        message.channel.send(`Join vc, brother KKona **( ͡° ͜ʖ ͡°)**`);
        }
    },
};