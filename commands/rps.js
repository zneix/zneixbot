exports.description = 'Plays a rock-paper-scissors game with bot.';
exports.usage = '<rock | paper | scissors>'
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
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
    const choices = {
        0: 'Rock',
        1: 'Paper',
        2: 'Scissors'
    }
    const winnerMessages = {
        0: `It's a draw... ${client.emoteHandler.find('PauseChamp')}`,
        1: `You won ${client.emoteHandler.find('ZULUL')}`,
        2: `You lost ${client.emoteHandler.find('LUL')}`
    }
    if ((uc = usersChoice()) < 0) throw ['normal', 'Wrong choice! Use either **rock**, **paper** or **scissors**.'];
    let bc = Math.floor(Math.random() * 3);
    let winner;
    if (uc == bc) winner = 0; //draw (nobody wins)
    if (uc == 0 && bc == 1) winner = 2; //bot wins
    if (uc == 0 && bc == 2) winner = 1; //user wins
    if (uc == 1 && bc == 0) winner = 1;
    if (uc == 1 && bc == 2) winner = 2;
    if (uc == 2 && bc == 0) winner = 2;
    if (uc == 2 && bc == 1) winner = 1;
    message.channel.send(`You chose ${choices[uc]}, I chose ${choices[bc]}.\n${winnerMessages[winner]}`);
}