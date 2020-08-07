const formatter = require('./formatter');
const lt = require('long-timeout'); //makes it possible to have a timeout or interval that is longer than 24.8 days (2^31-1 ms)

//load jobs on bot startup
exports.loadScheduledJobs = async function(){
    let jobsToRun = await client.db.utils.find('crons', {runAtTimestampMs: {$ne: null}});
    jobsToRun.forEach(job => {
        let totalTimeMs = job.runAtTimestampMs - job.insertedAtTimestampMs; //approx time of for how long the job was scheduled
        console.log(`Scheduling job, ID: ${job.id}`);
        lt.setTimeout(function(){
            console.log(`...running scheduled cronjob, ID: ${job.id}`);
            exports.jobs[job.name](Math.floor(totalTimeMs/1000), job.id, job.params) //the scheduled job itself
            .catch(err => {
                //updating cronjob document and marking it as failed
                console.error(`Error while executing cronjob: ${err}`);
                client.db.db().collection('crons').findOneAndUpdate({id: job.id}, { $set: {
                    runAtTimestampMs: null,
                    finishedBy: `${client.user.tag}#${process.pid}`,
                    finishedTimestamp: Date.now(),
                    failed: true,
                    error: {
                        stack: err.stack ? err.stack : null,
                        err: err.toString()
                    }
                } });
            })
            .then(() => {
                //updating cronjob document and marking it as successfully executed
                client.db.db().collection('crons').findOneAndUpdate({id: job.id}, { $set: {
                    runAtTimestampMs: null,
                    finishedBy: `${client.user.tag}#${process.pid}`,
                    finishedTimestamp: Date.now(),
                    failed: false
                } });
            });
        }, job.runAtTimestampMs - Date.now());
    });
    return jobsToRun.length;
}

const cronjob = require('cron').CronJob;

exports.startCrons = function(){
    Object.keys(exports.crons).forEach(cron => {
        exports.crons[cron].start();
    });
}

exports.stopCrons = function(){
    Object.keys(exports.crons).forEach(cron => {
        exports.crons[cron].stop();
    });
}

exports.crons = {
    changestatus: new cronjob('0 */15 * * * *', async function(){
        //changing discord client's presence every 15 minutes
        await require('./presence')()
        .catch(err => {
            console.error(`Error while updating presence!\n${err}`);
        })
        .then(() => {
            console.log('[cron] Updated client presence');
        });
    })
}

//possibly end all the jobs on graceful shutdown
//exports.exit = async function(){}

//job document template
//schedule a job - insert things to database
exports.schedule = async function(name, timeInSeconds, params){
    let jobid = await client.db.utils.getAutoincrement('crons');
    await client.db.utils.insert('crons', [{
        id: jobid,
        name: name,
        params: params, //can be whole object full of different stuff
        insertedAtTimestampMs: Date.now(),
        runAtTimestampMs: Date.now() + (timeInSeconds * 1000),
        insertedBy: `${client.user.tag}#${process.pid}`,
        finishedBy: null, //this will be modified by process that finishes the job
        finishedTimestamp: null, //huge fan of timestamps right here
        failed: null,
        /* above should be changed to bool that states
        whether job failed to run at specified time or not */
        error: null //possible error that may occur while executing scheduled job
    }]).catch(err => console.error(err));
    lt.setTimeout(function(){
        console.log(`...running scheduled cronjob, ID: ${jobid}`);
        exports.jobs[name](timeInSeconds, jobid, params) //the scheduled job itself
        .catch(err => {
            //updating cronjob document and marking it as failed
            console.error(`Error while executing cronjob: ${err}`);
            console.error(err.stack);
            client.db.db().collection('crons').findOneAndUpdate({id: jobid}, { $set: {
                runAtTimestampMs: null,
                finishedBy: `${client.user.tag}#${process.pid}`,
                finishedTimestamp: Date.now(),
                failed: true,
                error: {
                    stack: err.stack ? err.stack : null,
                    err: err.toString()
                }
            } });
        })
        .then(() => {
            //updating cronjob document and marking it as successfully executed
            client.db.db().collection('crons').findOneAndUpdate({id: jobid}, { $set: {
                runAtTimestampMs: null,
                finishedBy: `${client.user.tag}#${process.pid}`,
                finishedTimestamp: Date.now(),
                failed: false
            } });
        });
    }, timeInSeconds * 1000);
    return jobid; //just to let users know what is the ID of newly created cronjob
}

//define job types
exports.jobs = {
    //function(timeInSeconds, userid, guildid, modtag, reason){
    tempban: async (time, jobid, params) => {
        /* params for this job:
        guildid - guild's ID
        userid - banned user's ID
        reason - reason of temporary ban
        modtag - user.tag of moderator that executed the action
        */
        client.guilds.cache.get(params.guildid).members.unban(params.userid, `${params.reason ? `${params.reason} || ` : ''}executed after: ${formatter.msToHuman(time * 1000, 4)}`);
    },
    giveaway: async (time, jobid, params) => {
        /* params for the command
        channelid: message.channel.id, - channel, where command was executed
        destChannelid: channel.id, - channel, where there's a giveaway
        giveawayMsgid: giveawayMsg.id, - giveaway message's ID
        giveawayInfo: {
            subject: userMsg || null, - the giveaway note, message
            winners: message.args[2] - amount of winners (number)
        }
        */
        //clearances
        let destChannel = client.channels.cache.get(params.destChannelid);
        if (!destChannel) return; //client.channels.cache.get(params.orig[0]).send(`Giveaway Error (ID ${params.dest[1]})! Channel was deleted or I lack permissons to see it!`);
        let message = destChannel.messages.cache.get(params.giveawayMsgid) || await destChannel.messages.fetch(params.giveawayMsgid).catch(err => {client.channels.cache.get(params.channelid).send(`Error while resolving giveaway (ID ${jobid})! \`${err}\``);null;});

        if (!message) return; //client.channels.cache.get(params.channelid).send(`Error while resolving giveaway (ID ${jobid})! Giveaway message has been deleted or I don't have permissons to see it!`);
        //fetching in case bot rebooted before giveaway ended and bot doesn't have all reactions cached, has to be improved later
        if (message.reactions.cache.get('🎉').users.cache.size != message.reactions.cache.get('🎉').count){
            await message.reactions.cache.get('🎉').users.fetch(); //.then(f => Math.max([...f.keys()]) ); //finish better fetching all reactions
        }
        //get pool of all users that reacted to giveaway message
        let pool = [...message.reactions.cache.get('🎉').users.cache.keys()];
        //remove bot's reaction
        let index = pool.indexOf(client.user.id);
        if (index > -1) pool.splice(index, 1);

        //escaping on empty giveaways...
        if (!pool.length){
            await message.edit('🎉 Giveaway has finished!', {embed: {
                color: 0x2f3136,
                timestamp: new Date(),
                footer: {
                    text: `Hosted by ${message.author.tag} | Ended At`,
                    icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
                },
                author: {
                    name: params.giveawayInfo.subject || 'A giveaway'
                },
                description:
                `Giveaway lasted for: **${formatter.msToHuman(time * 1000, 4)}**`
                +`\nWinners: 0`
            }});
            destChannel.send(`Couldn't determine giveaway winners (ID ${jobid})\n${message.url}`);
            return;
        }

        //select random winner(s)
        let winners = function(){
            let winnerArray = [];
            for (let i = 0; i < Math.min(params.giveawayInfo.winners, pool.length); i++) winnerArray.push(pool.filter(x => !winnerArray.includes(x))[Math.floor(Math.random() * pool.length)]);
            return winnerArray.map(id => `<@${id}>`);
        }();
        await message.edit('🎉 Giveaway has finished!', {embed: {
            color: 0x2f3136,
            timestamp: new Date(),
            footer: {
                text: `Hosted by ${message.author.tag} | Ended At`,
                icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            author: {
                name: params.giveawayInfo.subject || 'A giveaway'
            },
            description:
            `Giveaway lasted for: **${formatter.msToHuman(time * 1000, 4)}**`
            +`\nWinner${winners.length == 1 ? ': ' : '(s):\n'}${winners.join('\n')}`
            +`\nWin chance: **${winners.length ? `${formatter.round(winners.length * 100 / pool.length, 2)}` : '0'}%**`
        }});
        if (winners.length) destChannel.send(`Conratulations to ${winners.join(', ')}\nThey won the giveaway${params.giveawayInfo.subject ? `, **${params.giveawayInfo.subject}**` : ''}!\n${message.url}`);
    }
}