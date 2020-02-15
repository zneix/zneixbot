exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Assign/Revoke roles from you if used correctly. Run this command without arguments to get list of available roles to assign.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = async (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let data = (await client.db.utils.find('guilds', {guildid: message.guild.id}))[0];
        if (!Object.getOwnPropertyNames(data.modules.roles.units).length) return message.channel.send('There are no configured autoroles in this server, contact admins to set those via config commad!');
        if (!message.args.length){
            let embed = {
                color: 0x843598,
                timestamp: message.createdAt,
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                author: {
                    name: 'Available roles to assign'
                },
                description: fetchRoles()
            }
            return message.channel.send({embed:embed});
        }
        else {
            if (data.modules.roles.units[message.args[0].toLowerCase()]){
                if (!message.guild.roles.has(data.modules.roles.units[message.args[0].toLowerCase()])) return message.channel.send(`Role with given name \`${message.args[0].toLowerCase()}\` seems to be deleted, contact mods!`);
                let roleToAdd = message.guild.roles.get(data.modules.roles.units[message.args[0].toLowerCase()]);
                if (roleToAdd.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) return message.channel.send(`I can't add this role to you because of invalid role hierarchy, contact moderators!`);
                if (!message.member.roles.has(roleToAdd.id)){
                    await message.member.addRole(roleToAdd);
                    require(`../src/embeds/roleGrantRevoke`)(client, message, roleToAdd, true); //last bool: true = added, false = removed
                }
                else {
                    await message.member.removeRole(roleToAdd);
                    require(`../src/embeds/roleGrantRevoke`)(client, message, roleToAdd, false);
                }
            }
            else throw `Role with name \`${message.args[0]}\` doesn't exist in database! Run command without arguments to see available options.`;
        }
        function fetchRoles(){
            let str = 'If any of roles below are shown as \`@deleted-role\` contact mods to update configuration\n';
            Object.getOwnPropertyNames(data.modules.roles.units).forEach(r => {
                str = str.concat(`\`${r}\`: <@&${data.modules.roles.units[r]}>\n`);
            });
            return str;
        }
    });
}
