exports.description = 'Information about latest updates and code changes!';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    const changes = require('../src/json/changelog.json');
    message.channel.send({embed:{
        color: 0xf97304,
        timestamp: new Date(changes.timestamp),
        footer: {
            text: 'Date of last Major Update:'
        },
        author: {
            name: changes.header,
            url: changes.url
        },
        description: changes.text
    }});
}