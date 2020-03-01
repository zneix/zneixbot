const Agenda = require('agenda');
let formatter = require('./formatter');

exports.createAgenda = async function(dbclient){
    let agenda = await new Agenda({
        mongo: dbclient.db(),
        processEvery: 2000, //interval in ms between asking database for jobs to execute - also maximum latency for job execution
        name: 'zneixbot2#'+process.pid
    });
    agenda.on('ready', () => console.log('[agenda] initialized'));
    agenda.on('error', err => console.error('[!agenda] '+err));
    return agenda;
}
exports.defineJobs = function(client, agenda){
    agenda.define('vin', job => {
        client.channels.get(job.attrs.data[0]).send('zneix VON ZULUL !\n'+(Date.now() - job.attrs.data[1]) / 1000+'s');
        console.log('zneix VON ZULUL !\n'+Date.now()+'\n'+job.attrs.data[1]);
    });
    agenda.define('giveaway', async job => {
        //clearances
        let channel = client.channels.get(job.attrs.data.dest[0]);
        if (!channel) return client.channels.get(job.attrs.data.orig[0]).send(`Giveaway Error (ID ${job.attrs.data.dest[1]})! Channel was deleted or I lack permissons to see it!`);
        let message = channel.messages.get(job.attrs.data.dest[1]);
        if (!message) return client.channels.get(job.attrs.data.orig[0]).send(`Giveaway Error (ID ${job.attrs.data.dest[1]})! Message was deleted or I lack permissons to see it!`);
        //select random winner
        let pool = [...message.reactions.get('🎉').users.keys()];
        let index = pool.indexOf(client.user.id);
        if (index > -1) pool.splice(index, 1);
        //functions
        function getWinnersIDs(pool){
            let winners = [];
            let wnum = parseInt(job.attrs.data.ginfo.winners);
            if (pool.length >= wnum){
                for (let i=0; i < wnum;){
                    let potentialWinner = pool[Math.floor(Math.random()*pool.length)];
                    if (!winners.includes(potentialWinner)){
                        winners.push(potentialWinner);
                        i++;
                    }
                }
                return winners;
            }
            else return pool;
        }
        let ourWinners = getWinnersIDs(pool);
        function printWinners(ids, doInline){
            if (!ids.length) return 'None.';
            let str = '';
            if (doInline) ids.forEach(id => str += `<@${id}>, `);
            else ids.forEach(id => str += `<@${id}> ${client.users.get(id).tag}\n`);
            return str;
        }
        let embed = {
            color: 0x2f3136,
            timestamp: new Date(),
            footer: {
                text: `Hosted by ${message.author.tag}`,
                icon_url: message.author.avatarURL
            },
            author: {
                name: `🎉 Giveaway has finished!`
            },
            description: `Subject: **${job.attrs.data.ginfo.subject || 'Not specified.'}**`
            +`\nGiveaway lasted for: **${formatter.msToHuman(job.attrs.data.ginfo.time*1000)}**`
            +`\nWinner(s): **${printWinners(ourWinners, false)}**`
            +`\nWin chance: **${ourWinners.length?`${formatter.round(ourWinners.length*100 / pool.length, 2)}`:'0'}%**`
        }
        await message.edit({embed: embed});
        if (ourWinners.length) await channel.send(`Conratulations to ${printWinners(ourWinners, true)}\nThey won the giveaway${job.attrs.data.ginfo.subject?`, **${job.attrs.data.ginfo.subject}**`:''}!\nMessage link: ${message.url}`);
    });
}
exports.SIGINT = async function(agenda){
    await agenda.stop().then(a => console.log(`[agenda] stopped gracefully`)); //decided to put a variable in here, maybe it logs something eShrug
}