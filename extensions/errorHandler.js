const Discord = require('discord.js');
Discord.Message.prototype.command = async function(num, func){
    try {
        var args = this.content.split(/ +/g);
        if (num) {
            // if (num + 1 <= args.length) throw "Too many arguments!" //I guess this one is useless for now, so I've disabled it
            if (num - 1 >= args.length) throw "Too few arguments!"
        }
        func().catch(async err => {
            console.log(err);
            console.trace("Async/Promise rejection command error: "+err);
            embedError();
            
        });
    }
    catch (error) {
        console.trace("Sync command error: "+error);
        embedError();
        
    }
    this.delete(0);
    embedError = async function(){
        var embed = {
            color: 0xff5050,
            author: {
                    name:this.channel.guild.name+" — \""+this.channel.name+"\"",
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
}