exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Asks 8ball a question (basic random responses).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [question]`;
exports.perms = 'user';

exports.run = (client, message) => {
    const emote = require('../utils/emoteHandler')(client);
    message.cmd = this;
    message.command(false, async () => {
        let responses = [
            "idk kev",
            "maybe later",
            "undefined.",
            "**BOTTOM TEXT**",
            "Pepega af",
            "mayhaps",
            "sure Kapp",
            "the third one",
            "python sucks",
            "bad",
            "RRRRRRRRRRAUUUUUUUUUUUUUUUUUUUUUUUUL",
            "yeah, but your question is like a third-party thing and idk ;forsenCD;",
            "weź spierdalaj, nie chce mi się już z Tobą gadać",
            "ask Wit, he will know ;Kapp;",
            "not sure how to answer, but you von ;ZULUL;",
            "you're smort, no doubt ;5Head;",
            "Wuv you <3 ;peepoLove;",
            "brhjbknhuwegfhmkuweghrfekumesfghg",
            "hamburger",
            "John Cena",
            "don't ask me that",
            "the answer is even more dumb than you",
            "that qualifies for a bruh moment of the week",
            "20% cooler than you ;EZ;",
            ";forsenPls; ;forsenPls; ;forsenPls; ;forsenPls; ;forsenPls;",
            "ponies are the answer to everything ;fastlyragroove;",
            "nie wiem (idk) ;Pappa;",
            "China!",
            "they're taking the hobbits to Isengard",
            "Darude Sandstorm ;Kappa;",
            "puck the flebs ;forsenC; ;forsenGun;",
            "أمك مثلي الجنس ;ANELE; ;Clap;",
            ""
        ];
        let rng = Math.floor(Math.random()*(responses.length));
        message.reply(clean(responses[rng])
        );
        function clean(string){
            string = string.replace(/@everyone/, "`@everyone`"); //filters everyone mentions
            string = string.replace(/@here/, "`@here`"); //filters here mentions
            //TODO: Finish this escape later, when more advanced responses will be added.
            // if (/<:[a-z0-9-_]+:\d+>/i.test(string) || /<a:[a-z0-9-_]+:\d+>/i.test(string)) {
            //     console.log("that had "+(/<a:[a-z0-9-_]+:\d+>/i.test(string)?"animated":"regular")+" emote");
            //     if (/<:[a-z0-9-_]+:\d+>/i.test(string)) string = string.replace(/<:[a-z0-9-_]+:\d+>/i, "<userEmote>");
            //     if (/<a:[a-z0-9-_]+:\d+>/i.test(string)) string = string.replace(/<a:[a-z0-9-_]+:\d+>/i, "<userAnimatedEmote>");
            // }
            if (/;[a-z0-9-_]*?;/i.test(string)) {
                do {
                    //emote replacer
                    let eth = /;[a-z0-9-_]*?;/i.exec(string)[0]; //eth - emotes to handle
                    string = string.replace(eth, emote.find(eth.slice(1, -1)));
                } while (/;[a-z0-9-_]*?;/i.test(string));
            }
            return string;
        }
    });
}