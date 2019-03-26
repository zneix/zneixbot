module.exports = {
    name: `mpurge`,
    description: `deletes some messages in specified channel`,
    execute(message, args, config) {
        if (!message.guild.members.get(message.author.id).hasPermission(['MANAGE_MESSAGES'])) {
            console.log(`Wow! \'${message.author.tag}\' tried to use mpurge command ;v`);
            try {message.react(config.emojis.PepeLaugh);} catch (error) {console.log(`Error with reacing, LOL!`)};
            return null;
        }
        if (!args.length) return message.reply(`too few arguments!\nusage: ${config.prefix}mpurge <number of messages to be deleted>`);
        if (isNaN(args[0])) return message.reply(`The argument \`${args[0]}\` is not a valid number!`);
        if (args[0] > 100) return message.reply(`woah, too big amount!\nyou can only delete 100 messages at once!`);
        async function mpurge(){
            await message.delete();
            const fetched = await message.channel.fetchMessages({limit: args[0]});
            console.log(`${fetched.size} messages found in '${message.channel.name}', deleting...`);
            message.channel.bulkDelete(fetched).catch(error => message.channel.send(`Error:\n\`\`\`\n${error}\n\`\`\``));
        }
        mpurge();
    },
};