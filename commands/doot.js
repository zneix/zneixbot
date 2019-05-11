module.exports = {
    name: `doot`,
    description: `plays DOOT theme`,
    execute(message) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => {
            const dispatcher = connection.playFile('./media/doot.mp3');
            message.channel.send('**DOOT!**')
            .then(() => console.log('playing DOOT!'));
            dispatcher.on('end', () => {
            // The song has finished
            message.member.voiceChannel.join()
                .then(connection => {
                    message.member.voiceChannel.leave();
                    message.channel.send(`Ended DOOTing in ${message.member.voiceChannel}!`);
                })
            });
            }).catch(console.error);
    } else {
        message.channel.send(`Join voice channel first :trumpet:`);
        }
    },
};