module.exports = {
    name: `agis`,
    description: `**plays aguz\'s favouite song**`,
    execute(message) {
		if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
			.then(connection => {
				console.log(`playing agis!`);
				const dispatcher = connection.playFile('D:/zneixbot/media/agis.mp3');
				message.channel.send('Playing agis!');
			dispatcher.on('end', () => {
			  // The song has finished
			  message.member.voiceChannel.join()
			  .then(connection => {
				  message.member.voiceChannel.leave();
				  message.channel.send(`I've disconnected from ${message.member.voiceChannel}!`);
			  })
			});
		})
		.catch(console.error);
		} else {
			message.channel.send(`Join voice channel first **( ͡° ͜ʖ ͡°)**`);
		}
    },
}