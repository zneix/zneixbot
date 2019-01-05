module.exports = {
    name: `help`,
    description: `displays a help message`,
    execute(message) {
        message.channel.send(
            `\`\`\``+
            `avalibe commands (use prefix 'zb '):`
            +`\nagis: '**good stuff m8**'`
            +`\n\`help\` - **dislpays this message**`
            +`\n\`inaczej\` - **plays _intermajor - płaska ziemia_**`
            +`\n\`leave\` - **disconnect bot from your voice channel**`
            +`\n\`lenny\` - **( ͡° ͜ʖ ͡°)**`
            +`\n\`nsfw\` - **tags current text channel as nsfw/sfw (use arguments)**`
            +`\n\`ping\` - **pong!**`
            +`\n\`server\` - **displays information about current server**~~ DISABLED FOR NOW, USE *test* INSTEAD`
            +`\n\`stats\` - **displays bot's statistics**`
            +`\n\`summon\` - **makes bot join voice channel you're already in**`
            +`\n\`tagme\` - **tags user**`
            +`\n\`user\` - **displays information about tagged user or yourself**`
            +`\`\`\``
        );
    },
};