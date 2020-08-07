exports.description = 'Displays lightweight leaderboard in a beautiful embed. Expires after 120 seconds.';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 30000;
exports.dmable = false;

exports.run = async message => {
    //comment that code later (and maybe add a cooldown? ;d)
    let data = await client.db.lvl.getLeaderboard(message.guild.id);
    const pageLimit = 10;
    let pages = Math.ceil(data.length / pageLimit);
    let page = 0;
    let msg = await message.channel.send({embed:updateEmbed()});
    await msg.react('1️⃣');
    await msg.react('⬅');
    await msg.react('➡');
    await msg.react('🇽');
    const collector = msg.createReactionCollector((reaction, user) => user.id == message.author.id, {time: 120000});
    collector.on('collect', async r => {
        if (!message.channel.permissionsFor(message.guild.me).missing(['MANAGE_MESSAGES']).length) await r.users.remove(message.author.id);
        switch (r.emoji.name){
            case '1️⃣':
                page = 0;
                break;
            case '➡':
                if (page >= pages-1) return;
                page++;
                break;
            case '⬅':
                if (page <= 0) return;
                page--;
                break;
            case '🇽':
                return collector.stop();
        }
        await msg.edit( message.channel.permissionsFor(message.guild.me).missing(['MANAGE_MESSAGES']).length ? 'I can\'t remove your reactions due to lack of permissions' : '', {embed:updateEmbed()});
    });
    collector.on('end', () => { if (!message.channel.permissionsFor(message.guild.me).missing(['MANAGE_MESSAGES']).length) msg.reactions.removeAll(); });
    function updateEmbed(){
        let embed = {
            color: Math.floor(Math.random() * 256 * 256 * 256),
            timestamp: message.createdAt,
            footer: {
                text: `Requested by ${message.author.tag}`,
                icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            author: {
                name: `Leaderboard of ${message.guild.name}, Page ${page + 1}/${pages}`
            },
            description: buildDesc(page)
        }
        function reqXP(lvl){
            let sum = 0;
            for (let i = 0; i < lvl; i++) sum += 5 * Math.pow(i, 2) + 50 * i + 100;
            return sum;
        }
        function putMember(index){
            return data[index]
                ? `**${index+1}.** ${message.guild.member(data[index]['userid'])
                    ? `${message.guild.member(data[index]['userid'])} (${message.guild.member(data[index]['userid']).user.tag})`
                    : `User Left (${data[index]['userid']})`}\nLvl: **${data[index]['lvl']}** Exp: **${data[index]['xp'] - (data[index]['lvl'] ? reqXP(data[index]['lvl']) : 0)}/${reqXP(data[index]['lvl'] + 1) - reqXP(data[index]['lvl'])}** (tot. ${data[index]['xp']})\n\n`
                : '';
            }
        function buildDesc(page){
            let str = '';
            for (let i = 0; i < pageLimit; i++) str += putMember(page * pageLimit + i);
            return str;
        }
        return embed;
    }
}