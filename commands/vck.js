module.exports = {
    name: `vck`,
    description: `kicks tagged user from voice chat`,
    async execute(message, bot) {
        if (!message.guild.me.hasPermission(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) return message.channel.send(`missing permissions`);
		const taggedUser = message.mentions.members.first();
		if (!taggedUser) return message.channel.send(`You need to tag a fag`);
		if (!taggedUser.voiceChannel) return message.channel.send(`He's not in a vc`);

		const tempVC = await message.guild.createChannel('tempkick', 'voice', [
			{
				id: message.guild.id,
				deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
			},
			{
				id: taggedUser.id,
				deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
			},
			{
				id: bot.user.id,
				allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
			}
		]);
		await taggedUser.setVoiceChannel(tempVC);
		await tempVC.delete();
		message.react(`👌`);
    },
};