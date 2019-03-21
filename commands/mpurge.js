module.exports = {
    name: `mpurge`,
    description: `deletes some messages in specified channel`,
    execute(message, args, config) {
        if ((message.author.id != config.devid) || (message.author.id != message.guild.ownerID)) return console.log(`Wow! \'${message.author.tag}\' tried to use mpurge command ;v`);
        else {
            if (isNaN(args[0])) {
                message.channel.send(`Wrong argument, use: ${config.prefix}mpurge <amount (valid number)>`);
                return 
            }
            async function mpurge(){
                message.delete();
                const fetched = await message.channel.fetchMessages({limit: args[0]});
                console.log(`${fetched.size} messages found, deleting...`);
                message.channel.bulkDelete(fetched).catch(error => message.channel.send(`Error:\n\`\`\`\n${error}\n\`\`\``));
            }
        mpurge();
        }
    },
}