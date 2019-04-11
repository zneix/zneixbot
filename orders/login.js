const serverList = [];
module.exports = {
    name: `login`,
    execute(bot, config, database, botServers) {
        botServers.forEach(guild => { serverList.push(`\n${guild.name} #${guild.id}`) });
        console.log(
            `Connected, logged as ${bot.user.tag}`
            +`\nClient servers (${serverList.length}):${serverList}`
            +`\n==================================`);
        var currentdate = new Date();
        var datetime = "" + currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
            const loginEmbed = {
                color: 0x11ff11,
                author: {
                    name: `Client logged in`
                },
                title: `Logged in as: ${bot.user.tag}`,
                description: `info message`,
                // thumbnail: {none},
                fields: [
                    {
                        name: `Time logged in`,
                        value: `${datetime}`,
                        inline: true
                    },
                    {
                        name: `User count`,
                        value: bot.users.size,
                        inline: true
                    },
                    {
                        name: `Channel count`,
                        value: bot.channels.size,
                        inline: true
                    },
                    {
                        name: `Client servers (${serverList.length})`,
                        value: `${serverList}`,
                        inline: false
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: `zneixbot by zneix#4433`
                }
            }
        bot.channels.get(config.logs.login).send({embed:loginEmbed});
        bot.user.setPresence({ status: 'dnd', game: { name: `${config.prefix}help, ver: ${config.botver}`, url: 'https://www.twitch.tv/zneix', type: 1 } });
        // //watykanczyk's code below =====================
        // setInterval(licznik, config.papiez.time.interval);
        // console.log(`interval timer initialized!`);
        // function licznik(){
        //     var currentdate = new Date();
        //     var datetime = ""
        //         + currentdate.getHours() + ":"
        //         + currentdate.getMinutes() + ":"
        //         + currentdate.getSeconds();
        //     // console.log(datetime);
        //     if (!datetime.startsWith(config.papiez.time.hour)) {/*console.log(`not >${config.papiez.time.hour}\n`);*/ return null;}
        //     else { //o 21:35 się wykonuje
        //         clearInterval(this);
        //         bot.guilds.forEach(async guild => {
        //             if (!database.guilds[guild.id]) return null;
        //             if (database.guilds[guild.id].papiez === `false`) return null;
        //             let textch = guild.channels.find(ch => ch.name === config.papiez.names.text);
        //             let role = guild.roles.find(r => r.name === config.papiez.names.role);
        //             // let mention = `<@&${role.id}>`
        //             await textch.send(`${role} 2137 EVENT JUŻ NIEDŁUGO!!!`);
        //         });
        //         console.log(`>${config.papiez.time.hour}:00 mentioned`);
        //         console.log(`waiting ${config.papiez.time.timeout / 1000}s for 21:37...`);
        //         setTimeout(betterBoy, config.papiez.time.timeout);
        //     }
        // }
        // function betterBoy(){
        //     console.log(`>21:37:00 is here, doing iter`);
        //     // bot.user.setPresence({ status: 'online', game: {name: `BARKAAAAA!!!`, type: 'LISTENING'}});
        //         bot.guilds.forEach(guild => {
        //             if (!database.guilds[guild.id]) return null;
        //             if (database.guilds[guild.id].papiez === `false`) return null;
        //             let textch = guild.channels.find(ch => ch.name === config.papiez.names.text);
        //             let vc = guild.channels.find(ch => ch.name === config.papiez.names.voice);
        //             let role = guild.roles.find(r => r.name === config.papiez.names.role);
        //             // let mention = `<@&${role.id}>`;
        //             if (!vc) return console.error("The channel does not exist!");
        //             vc.join().then(connection => {
        //                 console.log(`Connected to vc (${vc.id})`);
        //                 const dispatcher = connection.playArbitraryInput(config.papiez.file.web);
        //                 // const dispatcher = connection.platFile(config.papiez.file.heroku);
        //                 textch.send(`${role} BARKA TIME!`);
        //                 dispatcher.on('end', () => {
        //                     console.log(`Event has ended!`);
        //                     vc.leave();
        //                     textch.send(`${role} 21:37 event się skończył! :crab:`);
        //                     bot.user.setPresence({ status: 'dnd', game: {name: `czekanie na 21:37 ;v`, type: 'WATCHING'}});
        //                     console.log(`returning...`);
        //                     return null;
        //                 });
        //             }).catch(e => {console.error(e);});
        //         });
        // }
    }, //end huju
}