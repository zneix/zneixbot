//predefined error codes with their respective messages
let labels = {
    //1x - client error (invalid requests, user's lacking perms, etc...)
    '11': "You've successfully spawned an error",
    '12': "Invalid user's role hierarchy",
    '13': "Insufficient user permissions", //extra
    '132': "Insufficient user permissions", //extra, banned's perms
    '14': "Need more arguments", //extra
    // '142': "Too few arguments, {} is the required minimum", //few (${num}) //label is not used for this
    // '143': "Too many arguments, {} is max", // many (${num})
    '15': "Invalid arguments",
    //2x - non-client/bot error (like insufficent perms, etc...)
    '21': "Third-party error", //forsenCD
    '22': "Invalid bot's role hierarchy",
    '23': "Insufficient bot permissions", //extra
    '232': "Insufficient bot permissions", //channel-based perms
    '26': "Unable to execute this", //like command not existing in command folder
    '27': "An unexpected error" //all other errors, might be used by misc/uncategorized or even unexpected ones
};
let codes = {
    //0x - good
    '00': 'Executed successfully', //no message
    '01': 'Executed successfully with extra response',
    //1x - client error (invalid requests, user's lacking perms, etc...)
    '11': "**`{}`**",
    '12': "You can't manage users unless you have a higher role",
    '13': "Required perms: **{}**", //extra
    '132': "You are banned from the bot", //extra
    '14': "Specify: {}", //extra
    '142': "Too few arguments, {} is required minimum", //few (${num})
    // '143': "Too many arguments, {} is max", // many (${num})
    '15': "{}",
    //2x - non-client/bot error (like insufficent perms, etc...)
    '21': "**`{}`**", //forsenCD
    '22': "I need higher role in order to perform that on **`{}`**",
    '23': "Required perms: **{}**. Contact moderators!", //extra
    '232': "I'm missing permissions in channel **{}**. Contact moderators!", //channel-based perms
    '26': "Reason: {}", //like command not existing in command folder
    '27': "**`{}`**" //all other errors, might be used by misc/uncategorized or even unexpected ones
};
const Discord = require('discord.js');
Discord.Message.prototype.command = async function(num, func){
    try {
        //argument declaration
        let args = this.content.slice(this.guild.prefix.length).trim().split(/[ \s]+/g).slice(1);
        if (num){
            // if (num <= args.length) return this.channel.send(`${this.client.emoteHandler.dev('FeelsDankMan')} 👇\n${codes['143'].replace(/{}/, num)}`); //I guess this one is useless for now, so I've disabled it
            if (num > args.length) return this.channel.send(`${this.client.emoteHandler.dev('FeelsDankMan')} 👉 ${codes['142'].replace(/{}/, num)}`);
        }
        try {
            //pseudo error codes
            func().then(resp => {
                if (isErrored(this, resp) == 'clear') this.client.cc++;
            });
            //executes after command returns no issues (tl;dr when error flag === 0)
            this.client.logger.command(this, this.cmd, typeof this.cmd.perms !== "string"?"guild-perm":this.cmd.perms);
        }
        catch (err){this.client.logger.caughtError(this, err, "reject");}
    }
    catch (error){this.client.logger.caughtError(this, error, "sync");}
    //executes whether promise was resolved or not
    finally {
        // this.delete(0); //removed due to confusion sometimes
    }
}
function isErrored(message, resp){
    //handling errors like a boss
    if (typeof resp != 'object') return 'clear';
    if (!resp.code) return 'clear';
    if (resp.code[0] == '0') return 'clear';
    else {
        //unsuccessfull execution (emitted user-defined error in the middle of a command)
        let errMsg = labels[resp.code];
        switch(resp.code[0]){
            case '0':break;
            case '1':errMsg += ` ${message.client.emoteHandler.dev('PeepoGlad')} 👇`;break;
            case '2':errMsg += ` ${message.client.emoteHandler.dev('PepeS')} 👇`;break;
        }
        errMsg += `\n${codes[resp.code].replace(/{}/, resp.msg)}`;
        message.channel.send(errMsg);
    }
}
exports.isErrored = isErrored;