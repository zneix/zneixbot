module.exports = {
    name: `ban`,
    description: `bans an user from the server`,
    execute(message, bot, config, args) {
        if (!message.guild.members.get(message.author.id).hasPermission(['BAN_MEMBERS'])) return message.channel.send(`why are you gay?\nStop using commands you can't use <:${bot.emojis.get(config.emojis.fourHEad).name}:${config.emojis.fourHEad}>`);
        if (!message.guild.me.hasPermission(['BAN_MEMBERS'])) return message.channel.send(`I can't ban ppl in here (missing permissions!)`);
        if (!args.length) return message.reply(`you have to tag a member or provide valid user ID!\n\nExample: \`${config.prefix}ban @user <optional reason>\``);
        const taggedUser = message.mentions.users.first();
        
        if (!taggedUser) {
            if (args[0] === config.devid) return message.channel.send(`Why are you trying to ban zneix? ;_;\nI wouldn't kick my father ;(`);
            if (args[0] === bot.user.id) return message.channel.send(`Oh, you bastard <:${bot.emojis.get(config.emojis.fourHEad).name}:${config.emojis.fourHEad}>`);
            let validUID = bot.users.get(args[0]);
            if (!validUID) return message.reply(`wut? this user ID is invalid lol`);
            if (!message.guild.members.get(validUID).bannable) return message.channel.send(`I can't ban this user\nMaybe he has a higher role?`);
            //banning user by ID...
            try {
                if (!args[1]) rezon = "no reason specified";
                args.splice(0,1);
                if (!rezon) var rezon = args.join(" ");
                message.guild.members.get(validUID.id).ban(rezon)
                .then(() => message.channel.send(`Banned ${validUID} \`reason: ${rezon}\``))
                .then(() => console.log(`Banned ${validUID.tag} \`reason: ${rezon}\``));
                return null;
            } catch (error) {return message.channel.send(`I was unable to ban user with this ID!\nMaybe he has a higher role or something...`);}
        } else {
            if (taggedUser.id === config.devid) return message.channel.send(`Why are you trying to ban zneix? ;_;\nI wouldn't kick my father ;(`);
            if (taggedUser.id === bot.user.id) return message.channel.send(`Oh, you bastard <:${bot.emojis.get(config.emojis.fourHEad).name}:${config.emojis.fourHEad}>`);
            if (!message.guild.members.get(taggedUser.id).bannable) return message.channel.send(`I can't ban this user\nMaybe he has a higher role?`);
            //banning mentioned user...
            try {
                if (!args[1]) rezon = "no reason specified";
                args.splice(0,1);
                if (!rezon) var rezon = args.join(" ");
                message.guild.members.get(taggedUser.id).ban(rezon)
                .then(() => message.channel.send(`Banned ${taggedUser} \`reason: ${rezon}\``))
                .then(() => console.log(`Banned ${taggedUser.tag} \`reason: ${rezon}\``));
                return null;
        } catch (error) {return message.channel.send(`I was unable to ban this user!\nMaybe he has a higher role or something...`);}}
    },
};