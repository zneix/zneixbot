exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Plays a rock-paper-scissors game with bot.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <rock | paper | scissors>`
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        function usersChoice(){
            switch(message.args[0].replace(/ń/, 'n').replace(/ż/, 'z').toLowerCase()){
                case 'r':
                case 'rock':
                case 'k':
                case 'kamien':
                    return 0;
                case 'p':
                case 'paper':
                case 'papier':
                    return 1;
                case 's':
                case 'scissors':
                case 'n':
                case 'nozyce':
                    return 2;
                default: return -1;
            }
        }
        function fCh(n){
            switch(n){
                case 0: return 'Rock';
                case 1: return 'Paper';
                case 2: return 'Scissors';
            }
        }
        function fW(n){
            switch(n){
                case 0: return `It's a draw... ${client.emoteHandler.find('PauseChamp')}`;
                case 1: return `You won ${client.emoteHandler.find('ZULUL')}`;
                case 2: return `You lost ${client.emoteHandler.find('LUL')}`;
            }
        }
        if ((uc = usersChoice()) < 0) return {code: '15', msg: 'Wrong choice! Use either **rock**, **paper** or **scissors**.'};
        let bc = Math.floor(Math.random()*3);
        let winner;
        if (uc == bc) winner = 0; //draw (nobody wins)
        if (uc == 0 && bc == 1) winner = 2; //bot wins
        if (uc == 0 && bc == 2) winner = 1; //user wins
        if (uc == 1 && bc == 0) winner = 1;
        if (uc == 1 && bc == 2) winner = 2;
        if (uc == 2 && bc == 0) winner = 2;
        if (uc == 2 && bc == 1) winner = 1;
        message.channel.send(`You chose ${fCh(uc)}, I chose ${fCh(bc)}.\n${fW(winner)}`);
    });
}