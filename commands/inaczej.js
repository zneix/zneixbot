module.exports = {
    name: `inaczej`,
    description: `plays _intermajor - płaska ziemia_`,
    execute(message) {
        if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
			.then(connection => {
				console.log(`playing inaczej!`);
				const dispatcher = connection.playFile('./media/intermajor.mp3');
				message.channel.send('Inaczej?');
			dispatcher.on('end', () => {
			  // The song has finished
			  message.member.voiceChannel.join()
			  .then(connection => {
				  message.member.voiceChannel.leave();
				  message.channel.send(`no ogóem to kanał ${message.member.voiceChannel} ssie pałe`);
			  })
			});
		})
		.catch(console.error);
		} else {
			message.channel.send(`wejdź na kanał ugółem`);
		}
    },
};