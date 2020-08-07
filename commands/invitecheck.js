exports.description = 'Checks if provided discord invite exists and fetches information about it.';
exports.usage = '<Discord Invite>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 10000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    let regex = /((https?:\/\/)?(www\.)?(discord\.gg|discordapp\.com\/invite)\/)?([a-z0-9-]+)/i; //https://regex101.com/r/wzJlIC/1
    let inviteInfo = message.args[0].match(regex);
    if (!inviteInfo[5]) throw ['normal', 'Invalid invite was provided!']; //5th capturing group stores invite code info
    let invite = await require('../src/utils/apicalls').getDiscordInvite(inviteInfo[5]);
    if (!invite) throw ['normal', 'Provided invite doesn\'t exist!'];
    // let bannerURL = `https://cdn.discordapp.com/banners/${invite.guild.id}/${invite.guild.banner}.png`; //maybe try to utilize those in the future
    // let splashURL = `https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.png`;
    let guildIcon = `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.${/^a_/.test(invite.guild.icon) ? 'gif' : 'png'}`;
    const verificationLevels = {
        0: 'None',
        1: 'Low',
        2: 'Medium',
        3: '(╯°□°)╯︵┻━┻',
        4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻',
    }
    const {dateFormat, hourFormat, msToHuman} = require('../src/utils/formatter');
    let embed = {
        color: 0x78cb2a,
        timestamp: message.createdAt,
        footer: {
            text: '',
            icon_url: `https://cdn.discordapp.com/icons/288029287892910100/f9b216700062ead562d36419458c1930.png`
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
                value: `${client.emoteHandler.guild('dbots', 'online2')} ${invite.approximate_presence_count} **online**`
                +`\n${client.emoteHandler.guild('dbots', 'offline2')} ${invite.approximate_member_count} **total**`,
                inline: true
            },
            {
                name: 'Verification Level',
                value: verificationLevels[invite.guild.verification_level],
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