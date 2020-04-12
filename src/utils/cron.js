const formatter = require('./formatter');
const lt = require('long-timeout'); //makes it possible to have a timeout or interval that is longer than 24.8 days (2^31-1 ms)

//load jobs on bot startup
exports.load = async function(){
    let jobsToRun = await client.db.utils.find('crons', {runAtTimestampMs: {$ne: null}});
    jobsToRun.forEach(job => {
        let totalTimeMs = job.runAtTimestampMs - job.insertedAtTimestampMs; //approx time of for how long the job was scheduled
        console.log(`Scheduling job, ID: ${job.id}`);
        lt.setTimeout(function(){
            console.log(`...running scheduled job, ID: ${job.id}`);
            exports.jobs[job.name](Math.floor(totalTimeMs/1000), job.params) //the scheduled job itself
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
        exports.jobs[name](timeInSeconds, params) //the scheduled job itself
        .catch(err => {
            //updating cronjob document and marking it as failed
            console.error(`Error while executing cronjob: ${err}`);
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
}

//define job types
exports.jobs = {
    //function(timeInSeconds, userid, guildid, modtag, reason){
    tempban: async (time, params) => {
        /* params for this job:
        guildid - guild's ID
        userid - banned user's ID
        reason - reason of temporary ban
        modtag - user.tag of moderator that executed the action
        */
       console.log(params);
        client.guilds.cache.get(params.guildid).members.unban(params.userid, `${params.reason ? `${params.reason} || ` : ''}Responsible moderator: ${params.modtag} || executed after: ${formatter.msToHuman(time * 1000)}`);
    }
};