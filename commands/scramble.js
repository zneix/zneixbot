exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Generates 3x3x3 cube scramble.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = async (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let arr = [];
        let mainMoves = ["U", "F", "R", "D", "B", "L"];
        let oneOfSix = function(){
            return mainMoves[Math.floor(Math.random()*6)];
        };
        let random = function(){
            switch(Math.floor(Math.random()*3)){
                case 0:
                    return oneOfSix();
                case 1:
                    return ""+oneOfSix()+"'";
                case 2:
                    return ""+oneOfSix()+"2";
            };
        };
        do {
            let ver = random();
            if (arr.length) if (arr[arr.length-1].startsWith(ver.slice(0, 1))) continue;
            arr.push(ver);
        } while(arr.length < 20);
        message.channel.send(arr.join(" "));
    });
}