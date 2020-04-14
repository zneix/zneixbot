exports.description = 'Generates a scramble for standard rubik\'s cube (3x3x3).';
exports.usage = '';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3500;
exports.dmable = true;

exports.run = async message => {
    let mainMoves = ['U', 'F', 'R', 'D', 'B', 'L'];
    let oneOfSix = function(){ return mainMoves[Math.floor(Math.random()*6)];}
    let random = function(){
        switch(Math.floor(Math.random()*3)){
            case 0:
                return oneOfSix();
            case 1:
                return `${oneOfSix()}'`;
            case 2:
                return `${oneOfSix()}2`;
        }
    }
    let arr = [];
    do {
        let ver = random();
        if (arr.length) if (arr[arr.length-1].startsWith(ver.slice(0, 1))) continue;
        arr.push(ver);
    } while(arr.length < 20);
    message.channel.send(arr.join(' '));
}