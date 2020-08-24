exports.description = 'Checks if provided discord invite exists and fetches information about it.';
exports.usage = '<Discord Invite>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 10000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    //UserManager in discord.js v12 now checks invites with regex for us
    //old regex (with either discordapp.com and discord.com): https://regex101.com/r/wzJlIC/1
    let invite = await client.fetchInvite(message.args[0]).catch(err => { throw ['discordapi', err.toString()]; });
    if (!invite) throw ['normal', 'Provided invite doesn\'t exist!'];
    // let bannerURL = `${client.options.http.cdn}/banners/${invite.guild.id}/${invite.guild.banner}.png`; //maybe try to utilize those in the future
    // let splashURL = `${client.options.http.cdn}/splashes/${invite.guild.id}/${invite.guild.splash}.png`;
    let guildIcon = `${client.options.http.cdn}/icons/${invite.guild.id}/${invite.guild.icon}.${/^a_/.test(invite.guild.icon) ? 'gif' : 'png'}`;
    const verificationLevels = {
        'NONE': 'None',
        'LOW': 'Low',
        'MEDIUM': 'Medium',
        'HIGH': '(╯°□°)╯︵┻━┻',
        'VERY_HIGH': '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻',
    }
    const {dateFormat, hourFormat, msToHuman} = require('../src/utils/formatter');
    let embed = {
        color: 0x78cb2a,
        timestamp: message.createdAt,
        footer: {
            text: '',
            icon_url: `${client.options.http.cdn}/icons/288029287892910100/f9b216700062ead562d36419458c1930.png`
        },
        thumbnail: {
            url: guildIcon
        },
        description: `**Information about discord.gg/${invite.code}**`,
        fields: [
            {
                name: 'Server',
                value: `**${invite.guild.name}**\n${invite.guild.id}`,
                inline: true
            },
            {
                name: 'Server Age',
                value: `${dateFormat(invite.guild.createdAt)}, ${hourFormat(invite.guild.createdAt)}\n\`${msToHuman(message.createdTimestamp - invite.guild.createdTimestamp, 3)} ago\``,
                inline: true
            },
            {
                name: 'Channel',
                value: `${client.emoteHandler.guild('dbots', invite.channel.type == 2 ? 'voice' : 'channel')} ${invite.channel.name}\n${invite.channel.id}`,
                inline: false
            },
            {
                name: 'Member Count',
                value: `${client.emoteHandler.guild('dbots', 'online2')} ${invite.presenceCount} **online**`
                +`\n${client.emoteHandler.guild('dbots', 'offline2')} ${invite.memberCount} **total**`,
                inline: true
            },
            {
                name: 'Verification Level',
                value: verificationLevels[invite.guild.verificationLevel],
                inline: true
            }
        ]
    }
    if (invite.inviter){
        embed.fields.push({
            name: 'Inviter',
            value: `<@${invite.inviter.id}> ${invite.inviter.id}`,
            inline: false
        });
    }
    if (invite.guild.features.length){
        embed.fields.push({
            name: 'Server Perks',
            value: invite.guild.features.map(f => `\`${f}\``).join(' | '),
            inline: false
        });
    }
    message.channel.send({embed:embed});
}