exports.description = 'Picks random integer between two provided numbers (inclusive)\nIf no numbers are provided, picks a random number between 1-100\nIf one number is provided, picks a random number between 1 and that number.';
exports.usage = '[first number] [last number]\n1 100\n21 37';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.pipeable = false;

exports.run = async message => {
    let num1 = message.args[0] ? message.args[0].replace(/,/g, ".") : null;
    let num2 = message.args[1] ? message.args[1].replace(/,/g, ".") : null;
    if (isNaN(message.args[0])) roll(1, 100);
    else if (isNaN(message.args[1])) roll(1, num1);
    else roll(num1, num2);
    function roll(first, last){
        let random = Math.floor((parseInt(first)) + (Math.random()*(last-first+1)));
        message.channel.send(`Random number between **${first}** and **${last}**: \`${first == last ? first : random}\``);
    }
}