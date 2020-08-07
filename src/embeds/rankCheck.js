module.exports = async (message, userLvl) => {
    //boolReq is for getting required xp for next level
    function reqXP(lvl){
        let sum = 0;
        for (let i = 0; i < lvl; i++) sum += 5 * Math.pow(i, 2) + 50 * i + 100;
        return sum;
    }
    let embed = {
        color: 0xe7f135,
        timestamp: message.createdAt,
        footer: {
            text: message.guild.member(userLvl.userid) ? message.guild.member(userLvl.userid).user.tag : message.author.tag,
            icon_url: message.guild.member(userLvl.userid) ? message.guild.member(userLvl.userid).user.avatarURL({format: 'png', dynamic: true, size: 4096}) : message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: `Level progress of ${message.guild.member(userLvl.userid) ? message.guild.member(userLvl.userid).user.tag : `${userLvl.userid} (user left)`}`
        },
        fields: [
            {
                name: 'Rank',
                value: await message.client.db.lvl.getRanking(message.guild.id, userLvl['userid']),
                inline: true
            },
            {
                name: 'Level',
                value: userLvl['lvl'],
                inline: true
            },
            {
                name: 'Experience',
                value: `${userLvl['xp'] - (userLvl['lvl'] ? reqXP(userLvl['lvl']) : 0)}/${reqXP(userLvl['lvl'] + 1) - reqXP(userLvl['lvl'])} (total: ${userLvl['xp']})`,
                inline: true
            }
        ]
    }
    message.channel.send({embed:embed});
}