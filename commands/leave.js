module.exports = {
    name: `leave`,
    description: `disconnects bot from voice channel you are already in`,
    execute(message) {
        if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
			.then(connection => {
				message.member.voiceChannel.leave();
				message.channel.send(`I've disconnected from ${message.member.voiceChannel}!`);
				return(null);
			})
		}
        else message.reply(`You must be in voice channel to let me leave ;c`);
    },
};