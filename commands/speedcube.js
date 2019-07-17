exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Generates 3x3x3 cube scramble.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.perms = `user`

exports.run = async (client, message) => {
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
        // console.log(random())
        do {
            let ver = random();
            // console.log(`${arr[arr.length-1]} === ${ver}`); //debug
            if (arr.length) if (arr[arr.length-1].startsWith(ver.slice(0, 1))) continue;
            arr.push(ver);
        } while(arr.length < 20);
        message.channel.send(arr.join(" "));
    });
}