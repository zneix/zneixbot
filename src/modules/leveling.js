module.exports = async message => {
    //escapes:
    //1. Per-guild (and maybe global later) enable
    //2. Blocked channel, blocked user
    //3. Defining Guild's set in it's Talked Recently object (so that 4. won't produce a undefined Type Error when accessing not defined Set)
    //4. Cooldowned users (those, who have talked recently)
    const config = client.go[message.guild.id].config.modules.leveling;
    if (!config.enabled) return;
    if (config.blacklist.includes(message.channel.id) || config.blocked.includes(message.author.id)) return;
    if (!client.go[message.guild.id].tr) client.go[message.guild.id].tr = new Set();
    if (client.go[message.guild.id].tr.has(message.author.id)) return;

    //cooldown add and schedule of its removal after interval below
    let cooldownMs = 60000; //cooldown value in miliseconds
    client.go[message.guild.id].tr.add(message.author.id);
    setTimeout(function(){client.go[message.guild.id].tr.delete(message.author.id)}, cooldownMs);

    //fetching (or adding new) user profile from database
    let userLvl = await client.db.lvl.findUser(message.guild.id, message.author.id);
    if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.author.id);

    //couting functions, 15-25 xp rng and summary xp required to hit next level
    let random = Math.floor(15 + Math.random() * 11);
    // let sum = 5 * Math.pow(userLvl['lvl'] + 1, 2) + 50 * (userLvl['lvl'] + 1) + 100;
    let sum = 0;
    for (let i = 0; i < userLvl['lvl'] + 1; i++) sum += 5 * Math.pow(i, 2) + 50 * i + 100;
    //adding xp
    userLvl['xp'] += random;
    //handling level ups
    if (userLvl['xp'] >= sum){
        userLvl['lvl']++;
        await client.db.lvl.updateUser(message.guild.id, message.author.id, { $set: {xp: userLvl['xp'], lvl: userLvl['lvl']} });
        //level up annoucment
        switch(config.announcetype){
            case 'embed':
                require('../embeds/levelUp')(message, message.channel, userLvl['lvl']);
                break;
            case 'react':
                let intEmotes = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
                await message.react('🎉');
                for (let i = 0; i < userLvl['lvl'].toString().length; i++) await message.react(intEmotes[userLvl['lvl'].toString().slice(i, i+1)]);
                break;
            case 'dm':
                require('../embeds/levelUp')(message, message.author, userLvl['lvl']);
                break;
            case 'channel':
                require('../embeds/levelUp')(message, message.guild.channels.cache.get(config.channel), userLvl['lvl']);
                break;
            case 'none':
                break;
        }
        //handling leveled role grant if such role exists in guild's config
        let rewardRoles = config.stackrewards
            ? (function(){
                let arr = [];
                Object.keys(config.rewards).filter(rew => rew <= userLvl['lvl']).map(rewSetKey => config.rewards[rewSetKey]).forEach(rewSet => {
                    arr.push(...rewSet);
                });
                return arr;
            })()
            : config.rewards[userLvl['lvl']];

        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return console.log(`[leveling:roleadd] Missing perms in ${message.guild.id}`);
        rewardRoles.filter(roleID => !message.member.roles.cache.has(roleID)).forEach(roleID => {
            let rewardRole = message.guild.roles.cache.get(roleID);
            if (rewardRole ? (rewardRole.position < message.guild.me.roles.highest.position) : false){
                console.log(`Adding role ${roleID} to ${message.author.tag}`);
                message.member.roles.add(rewardRole);
        }
        });
    }
    else await client.db.lvl.updateUser(message.guild.id, message.author.id, { $set: {xp: userLvl['xp']} });
}