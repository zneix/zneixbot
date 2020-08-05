exports.description = "Links yours or someone's avatar. When no/wrong args are provided, links yours.";
exports.usage = '[user ID | @mention]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    let user = await require('../src/utils/cache').getUserFromMessage(message, {useQuery: true});
    if (!user) throw ['normal', 'No user found! @Mention someone, use user ID, username or user tag (like zneix#4433).'];

    let avatarURL = user.avatarURL({format: 'png', dynamic: true, size: 4096});
    if (!avatarURL) throw ['normal', `User \`${user.tag}\` does not have an avatar`];
    let embed = {
        color: 0x852442,
        timestamp: message.createdAt,
        footer: {
            text: `Avatar of ${user.tag}`,
            icon_url: avatarURL
        },
        author: {
            name: `Avatar of ${user.tag}`,
            url: avatarURL
        },
        image: {
            url: avatarURL
        }
    }
    message.channel.send(`<${avatarURL}>`, {embed:embed});
}