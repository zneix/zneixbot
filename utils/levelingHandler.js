module.exports = async (client, message) => {
    //escapes:
    //1. Per-guild (and maybe global later) enable
    //2. Blocked channel, blocked user
    //3. Definition of Guild's set in global Talked Recently object (so that 4. won't produce a Type Error when accessing undefined Set)
    //4. Cooldowned users (those, who have talked recently)
    if (!message.guild.dbconfig.modules.leveling.enabled) return;
    if (message.guild.dbconfig.modules.leveling.blacklist.includes(message.channel.id) || message.guild.dbconfig.modules.leveling.blocked.includes(message.author.id)) return;
    if (!client.tr[message.guild.id]) client.tr[message.guild.id] = new Set();
    if (client.tr[message.guild.id].has(message.author.id)) return;

    //cooldown add and schedule of its removal after interval below
    let cooldownms = 60000; //cooldown value in miliseconds
    client.tr[message.guild.id].add(message.author.id);
    setTimeout(function(){client.tr[message.guild.id].delete(message.author.id)}, cooldownms);

    //fetching (or adding new) user profile from database
    let userLvl = await client.db.lvl.findUser(message.guild.id, message.author.id);
    if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.author.id);

    //couting functions, 15-25 xp rng and summary xp required to hit next level
    let random = Math.floor(15 + Math.random()*11);
    let sum = 0;
    for (i=0;i<userLvl["lvl"]+1;i++){
        sum += (5 * Math.pow(i, 2) + 50 * i + 100);
    }
    //handling level ups
    if ((userLvl["xp"]+random) > sum){
        userLvl["lvl"]++;
        await client.db.lvl.updateUser(message.guild.id, userLvl);
        //level up annoucment
        switch(message.guild.dbconfig.modules.leveling.announcetype){
            case "embed":
                require('../src/embeds/levelUp')(message, message.channel, userLvl["lvl"]);
                break;
            case "react":
                let intEmotes = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
                await message.react('🎉');
                for (i=0;i<userLvl["lvl"].toString().length;i++) await message.react(intEmotes[userLvl["lvl"].toString().slice(i, i+1)]);
                break;
            case "dm":
                require('../src/embeds/levelUp')(message, message.author, userLvl["lvl"]);
                break;
            case "none":
                break;
        }
        //handling leveled role grant if such role exists in guild's config
        if (message.guild.dbconfig.modules.leveling.rewards[userLvl["lvl"]]){
            let rewardRole = message.guild.roles.get(message.guild.dbconfig.modules.leveling.rewards[userLvl["lvl"]]);
            if (message.guild.me.hasPermission('MANAGE_ROLES') && (rewardRole?(rewardRole.calculatedPosition < message.guild.me.highestRole.calculatedPosition):false)) message.member.addRole(rewardRole);
        }
    }
    //regular xp add
    userLvl.xp += random;
    await client.db.lvl.updateUser(message.guild.id, userLvl);
}