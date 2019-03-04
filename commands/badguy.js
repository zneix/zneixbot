module.exports = {
    name: `badguy`,
    description: `You were really bad, didn't you?`,
    execute(message, args, fs) {
        if (!args.length) {
			return message.channel.send(`You have to specify an argument, ${message.author}!`);
		} else {
			const content = "boi!";
			fs.writeFile(`.thingy.txt`, content, (err) => {
				if (err) {
					console.error(err);
					return;
				};
				console.log(`created text file!`);
			});
		}
    },
}