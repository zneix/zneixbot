module.exports = {
    name: `summon`,
    description: `makes bot join voice channel you're already in`,
    execute(message) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => {
                message.channel.send(`I\'ve joined `+message.member.voiceChannel+`!`);
            })
      } else {
            message.reply('You need to join a voice channel first!');
          }
    },
};