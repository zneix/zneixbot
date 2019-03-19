module.exports = {
    name: `help`,
    description: `displays a help message`,
    execute(message) {
        message.channel.send(
            `avalibe commands (use prefix 'zb '):`
            // +`\n\`\`: ****`
            +`\n\`agis\`: '**good stuff m8**'`
            +`\n\`devtool\`: **developer tool [🛑]**`
            +`\n\`fanfik\`: **link to Wit's fanfik**`
            +`\n\`help\`: **dislpays this message**`
            +`\n\`inaczej\`: **plays _intermajor - płaska ziemia_**`
            +`\n\`leave\`: **disconnects me from your voice channel**`
            +`\n\`lenny\`: **( ͡° ͜ʖ ͡°)**`
            +`\n\`mpurge\`: deletes messages from text channel [📋 🛑]`
            +`\n\`nsfw\`: **tags current text channel as nsfw/sfw [📋 ✋]**`
            +`\n\`ping\`: **displays your ping to me**`
            +`\n\`server\`: **displays information about current server**`
            +`\n\`stats\`: **displays my statistics**`
            +`\n\`summon\`: **makes me join voice channel you're already in**`
            +`\n\`tagme\`: **tags user**`
            +`\n\`up\`: **checks if am online**`
            +`\n\`user\`: **displays information about tagged user ( <- 📋) or yourself**`
            +`\n\`vck\`: **kicks user from voice channel (use with caution!) [📋 ✋]**`
            +`\n\n📋 - requires arguments\n✋ - requires some permissions\n🛑 - requires super permissions (server owner or bot developer)`
        );
    },
};