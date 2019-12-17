module.exports = async (message, userLvl) => {
    //comment this code later
    function reqXP(){
        let sum = 0;
        for (i=0;i<userLvl["lvl"]+1;i++){
            sum += (5 * Math.pow(i, 2) + 50 * i + 100);
        }
        return sum;
    }
    function actualXP(){
        let sum = 0;
        for (i=0;i<userLvl["lvl"];i++){
            sum += (5 * Math.pow(i, 2) + 50 * i + 100);
        }
        return sum;
    }
    let embed = {
        color: 0xe7f135,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: 'Level progress of '+(message.guild.member(userLvl.userid)?message.guild.member(userLvl.userid).user.tag:`${userLvl.userid} (user left)`)
        },
        fields: [
            {
                name: 'Rank',
                value: await message.client.db.lvl.getRanking(message.guild.id, userLvl["userid"]),
                inline: true
            },
            {
                name: 'Level',
                value: userLvl["lvl"],
                inline: true
            },
            {
                name: 'Experience',
                value: userLvl["xp"]-actualXP()+"/"+(reqXP()-actualXP())+` (total: ${userLvl["xp"]})`,
                inline: true
            }
        ]
    }
    if (userLvl["lvl"] === 0) embed.fields[1].value = userLvl["xp"]+"/"+(reqXP()-actualXP())+` (total: ${userLvl["xp"]})`;
    message.channel.send({embed:embed});
}