const Discord = require('discord.js');
Discord.Message.prototype.command = async function(num, func){
    try {
        //argument declaration
        if (this.client.config.prefix.endsWith(" ")) {
                args = this.content.split(/ +/g);
                args.splice(0, 2);
            }
            else {
                args = this.content.slice(this.client.config.prefix.length).split(/ +/g);
                args.splice(0, 1);
            }
        if (num) {
            // if (num <= args.length) throw "Too many arguments!" //I guess this one is useless for now, so I've disabled it
            if (num > args.length) throw `Too few (${args.length}) arguments!`
        }
        try {
            await func();
            const logger = require('./logger')(this.client);
            logger.command(this, this.cmd, typeof this.cmd.perms !== "string"?"guild-perm":this.cmd.perms);
        }
        catch (err) {
            console.log(err);
            console.trace("Async/Promise rejection command error: "+err);
            var embed = {
                color: 0xff5050,
                author: {
                        name:this.guild.name+" — \""+this.channel.name+"\"",
                        icon_url: this.author.avatarURL
                    },
                    description: "**"+this.author.username+"#"+this.author.discriminator+":"+this.author.id+"** failed to call: ***"+this.content+"***",
                    fields:[
                        {
                            name: "Reason:",
                            value: err.substring(0,1023),
                        }
                    ],
                    timestamp: new Date()
            }
            this.channel.send({embed:embed}).then(msg => {if (this.client.config.delete.error) msg.delete(this.client.config.delete.time)});
        };
    }
    catch (error) {
        console.trace("Sync command error: "+error);
        var embed = {
            color: 0xff5050,
            author: {
                    name:this.guild.name+" — \""+this.channel.name+"\"",
                    icon_url: this.author.avatarURL
                },
                description: "**"+this.author.username+"#"+this.author.discriminator+":"+this.author.id+"** failed to call: ***"+this.content+"***",
                fields:[
                    {
                        name: "Reason:",
                        value: error.substring(0,1023),
                    }
                ],
                timestamp: new Date()
        }
        this.channel.send({embed:embed}).then(msg => {if (this.client.config.delete.error) msg.delete(this.client.config.delete.time)});
    }
    // this.delete(0); //removed due to confusion sometimes
}