module.exports = (message, destination, lvl) => {
    let embed = {
        color: 0x8ed938,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: 'Level up!'
        },
        description: `${message.author} just achieved level ${lvl}!`
    }
    destination.send({embed:embed});
    console.log(`{level-up} '${message.author.tag}' achieved level ${lvl}!`);
}