exports.description = "Flips a coin, heads or tails, true or false, yes or no.";
exports.usage = '[message]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = true;

exports.run = async message => {
    // According to Murray & Teare (1993), the probability of an American silver nickel landing on its edge is around 1 in 6000 tosses
    let num = Math.floor(Math.random() * 60000);
    let reply = num == 1 ? 'The coin landed on its edge! That happends only once in 6000!' : (num%2 ? 'Heads (yes)' : 'Tails (no)');
    message.reply(reply);
}