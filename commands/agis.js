module.exports = {
    name: `agis`,
    description: `**plays aguz\'s favouite song**`,
    execute(message, bot) {
		if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
			.then(connection => {
				const dispatcher = connection.playFile('./media/agis.mp3');
				message.channel.send('Playing agis!')
				.then(() => console.log('playing agis!'));
				dispatcher.on('end', () => {
					// The song has finished
					message.member.voiceChannel.join()
					.then(connection => {
						message.member.voiceChannel.leave();
						message.channel.send(`I've disconnected from ${bot.user.voiceChannel}!`);
					})
				});
			}).catch(console.error);
		} else {
			message.channel.send(`Join voice channel first **( ͡° ͜ʖ ͡°)**`);
			}
    },
}