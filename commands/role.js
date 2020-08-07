exports.description = 'Assigns/Revokes roles from you if used correctly. Run this command without arguments to get list of available roles to assign.';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = false;

exports.run = async message => {
    let roles = client.go[message.guild.id].config.modules.roles;
    if (!Object.getOwnPropertyNames(roles.units).length) return message.channel.send('There are no configured autoroles in this server, contact admins to set those via config commad!');
    if (!message.args.length) message.channel.send({embed:{
        color: 0x843598,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: 'Available roles to assign'
        },
        description: `If any of roles below are shown as \`@deleted-role\` contact mods to fix that\n\nExample: \`${message.prefix}${exports.name} ${Object.keys(roles.units)[0]}\`\n\n`
        +Object.getOwnPropertyNames(roles.units).map(r => `\`${r}\`: <@&${roles.units[r]}>`).join('\n')
    }});
    else {
        if (roles.units[message.args[0].toLowerCase()]){
            let roleToAdd = message.guild.roles.cache.get(roles.units[message.args[0].toLowerCase()]);
            if (!roleToAdd) return message.channel.send(`Role with given name \`${message.args[0].toLowerCase()}\` seems to be deleted, contact mods!`);
            if (roleToAdd.position >= message.guild.me.roles.highest.position) throw ['normal', "I can't add this role to you because of invalid role hierarchy, contact moderators!"];
            if (!message.member.roles.cache.has(roleToAdd.id)){
                await message.member.roles.add(roleToAdd);
                require(`../src/embeds/roleGrantRevoke`)(message, roleToAdd, true); //boolAdded: true = added, false = removed
            }
            else {
                await message.member.roles.remove(roleToAdd);
                require(`../src/embeds/roleGrantRevoke`)(message, roleToAdd, false);
            }
        }
        else throw ['normal', "Role with given name doesn't exist in database! Run command without arguments to see available options."];
    }
}
