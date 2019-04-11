module.exports = {
    name: `kick`,
    description: `kicks an user from the server`,
    execute(message, bot, config, args) {
        if (!message.guild.members.get(message.author.id).hasPermission(['KICK_MEMBERS'])) return message.channel.send(`why are you gay?\nStop using commands you can't use ${bot.emojis.get(config.emojis.fourHEad)}`);
        if (!message.guild.me.hasPermission(['KICK_MEMBERS'])) return message.channel.send(`I can't kick ppl in here (missing permissions!)`);
        if (!args.length) return message.reply(`you have to tag a member or provide valid user ID!\n\nExample: \`${config.prefix}kick @user <optional reason>\``);
        const taggedUser = message.mentions.users.first();
        
        if (!taggedUser) {
            if (args[0] === config.devid) return message.channel.send(`Why are you trying to kick zneix? ;_;\nI wouldn't kick my father ${bot.emojis.get(config.emojis.PepeHands)}`);
            if (args[0] === bot.user.id) return message.channel.send(`Oh, you bastard ${bot.emojis.get(config.emojis.fourHEad)}`);
            let validUID = message.guild.members.get(args[0]);
            if (!validUID) return message.reply(`this user is not in this server, or ID is wrong`);
            if (!message.guild.members.get(validUID).kickable) return message.channel.send(`I can't kick this user\nMaybe he has a higher role?`);
            if (validUID.highestRole.calculatedPosition > message.member.highestRole.calculatedPosition || validUID.highestRole.calculatedPosition === message.member.highestRole.calculatedPosition) return message.reply(`this guy has higher or equal role as yours\nwhy are you gay?`);
            //kicking user by ID...
            try {
                if (!args[1]) rezon = "no reason specified";
                args.splice(0,1);
                if (!rezon) var rezon = args.join(" ");
                message.guild.members.get(validUID.id).kick(rezon)
                .then(() => message.channel.send(`${bot.emojis.get(config.emojis.a.CrabPls)} Kicked ${validUID} ${bot.emojis.get(config.emojis.a.CrabPls)}\n\`reason: ${rezon}\``))
                .then(() => console.log(`Kicked ${validUID.tag} \`reason: ${rezon}\``));
                return null;
            } catch (error) {return message.channel.send(`I was unable to kick user with this ID!\nMaybe he has a higher role or something...`);}
        } else {
            if (taggedUser.id === config.devid) return message.channel.send(`Why are you trying to kick zneix? ;_;\nI wouldn't kick my father ;(`);
            if (taggedUser.id === bot.user.id) return message.channel.send(`Oh, you bastard ${bot.emojis.get(config.emojis.fourHEad)}`);
            if (!message.guild.members.get(taggedUser.id).kickable) return message.channel.send(`I can't kick this user\nMaybe he has a higher role?`);
            if (taggedUser.highestRole.calculatedPosition > message.member.highestRole.calculatedPosition || taggedUser.highestRole.calculatedPosition === message.member.highestRole.calculatedPosition) return message.reply(`this guy has higher or equal role as yours\nwhy are you gay?`);
            //kicking mentioned user...
            try {
                if (!args[1]) rezon = "no reason specified";
                args.splice(0,1);
                if (!rezon) var rezon = args.join(" ");
                message.guild.members.get(taggedUser.id).kick(rezon)
                .then(() => message.channel.send(`${bot.emojis.get(config.emojis.a.CrabPls)} Kicked ${taggedUser} ${bot.emojis.get(config.emojis.a.CrabPls)}\n\`reason: ${rezon}\``))
                .then(() => console.log(`Kicked ${taggedUser.tag} \`reason: ${rezon}\``));
                return null;
        } catch (error) {return message.channel.send(`I was unable to kick this user!\nMaybe he has a higher role or something...`);}}
    },
};