exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Ask 8ball a question (basic random responses).';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [question]`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let responses = [
            "idk kev",
            "maybe later",
            "undefined.",
            "**BOTTOM TEXT**",
            "Pepega af ;Pepega;",
            "mayhaps",
            "sure Kapp",
            "the third one",
            "python sucks",
            "bad",
            "RRRRRRRRRRAUUUUUUUUUUUUUUUUUUUUUUUUL",
            "yeah, but your question is like a third-party thing and idk ;forsenCD;",
            "weź spadaj, nie chce mi się już z Tobą gadać",
            "ask Wit, he will know ;Kapp;",
            "not sure how to answer, but you von ;ZULUL;",
            "smort question without a doubt, not sure if I can find a suitable answer ;5Head;",
            "Wuv you <3 ;peepoLove;",
            "brhjbknhuwegfhmkuweghrfekumesfghg ;FeelsSpecialMan;",
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
            "Darude Sandstorm ;duDudu; ;Kappa;",
            "puck the flebs ;forsenC; ;forsenGun;",
            "أمك مثلي الجنس ;ANELE; ;Clap;",
            "",
            "du bist ein Zurückgebliebene Missgeburt ;DatSheffy;",
            "I don't care ¯\\_(ツ)_/¯",
            "how about some spaghetti?",
            "order me a pizza pls, I'm too hungry to answer ;peepoSadDank;",
            "I like honey",
            "no u ;DansGame;",
            "<some dank answer that makes you smile> ;FeelsDankMan;",
            "doubtful ;haHAA;",
            "yesterday it would've been a yes, but today it's a yep ;PogChamp;",
            "**NEIN!** ;DatSheffy;",
            "look deep in your heart and you will see the answer ;KKona;",
            "next game plz ;ResidentSleeper;",
            "leaning towards no ;Jebaited;",
            "get hecking Jebaited, kid ;Jebaited;",
            "we we, nie podskakuj lepiej",
            "this response can be bought with zneixbot pro™ for only $4.99, ask bot devs for help (actually don't ;Kappa;)",
            "you'll have to wait ;KKona;",
            "Pommes Frites ;DatSheffy;",
            "she said yes! ;PogChamp;",
            "just get a house ;4HEad;",
            "Pommes Frittes",
            "yum, you died ;vorebaby;",
            "that's a yikes ;ajnerd;",
            "sans undertale sans undertale",
            "If you read this, I VON ;ZULUL;",
            "that might be actually a thing",
            "this feature is broken, ask zneix to finish it ;NaM; 👌",
            "nah, maybe tommorow dud",
            "your ISP sucks anyway LOOOOL ;4HEad;",
            ";WAYTOODANK; BAZA ;WAYTOODANK; WIRUSÓW ;WAYTOODANK; PROGRAMU ;WAYTOODANK; AVAST ;WAYTOODANK; ZOSTAŁA ;WAYTOODANK; ZAKTUALIZOWANA ;WAYTOODANK;",
            `this is a supa dank secret response that does literally nothing except pinging a developer\n${message.guild.members.get('288028423031357441')?`\*Inhales...\* ;monkaS; 📣 <@288028423031357441>`:"...Except he's not in this server ;NaM;"}`,
            "this is your lucky day and your answer is yes ;FeelsGoodMan; ;Clap;",
            "if you played a game of roulette last week, you'd actually win ;Okayga;",
            "I just like memes, don't bother me with your questions ;cease;",
            "sorry, I don't like anime ;DansGame;",
            "no matter what your question was, HTML is not a programming language",
            "ok boomer",
            "that may be a yes ;Kappa;",
            "well yes, but actually no",
            "KKappa ;KKona; 🤝 ;Kappa;",
            "asd",
            "DROP DATABASE",
            "that's obviously a no, why do you even bother me with that ;WutFace;",
            ";KKona; NEUTRAL SPAM ;KKona; NEUTRAL SPAM ;KKona; NEUTRAL SPAM ;KKona;",
            "answer is... $300",
            "782348287787834",
            "I'm pretty sure you already know the answer to that ;FeelsOkayMan;",
            "no, I don't know who J ;OMEGALUL; E is",
            ";FeelsDankMan;..... you liek pinapel on piza?",
            "Error 750: Didn't bother to compile and understand your question ;FeelsDankMan;",
            "Error 753: Syntax error, your question must contain an actual response ;FeelsDankMan;",
            "Error 754: Too many semi-colons to answer ;FeelsDankMan;",
            "Error 755: Not enough semi-colons to answer ;FeelsDankMan;",
            "Error 756: Insufficiently polite ;FeelsBadMan;",
            "Error 757: Excessively polite ;FeelsWeirdMan;",
            "Error 706: Delete your account",
            "Error 710: PHP DETECTED, PAJLADA DISAPPROVES",
            
        ];
        let rng = Math.floor(Math.random()*(responses.length));
        message.reply(clean(responses[rng]));
        function clean(string){
            string = string.replace(/@everyone/, "`@everyone`"); //filters everyone mentions
            string = string.replace(/@here/, "`@here`"); //filters here mentions
            //TODO: Finish this escape later, when more advanced responses will be added.
            // if (/<:[a-z0-9-_]+:\d+>/i.test(string) || /<a:[a-z0-9-_]+:\d+>/i.test(string)){
            //     console.log("that had "+(/<a:[a-z0-9-_]+:\d+>/i.test(string)?"animated":"regular")+" emote");
            //     if (/<:[a-z0-9-_]+:\d+>/i.test(string)) string = string.replace(/<:[a-z0-9-_]+:\d+>/i, "<userEmote>");
            //     if (/<a:[a-z0-9-_]+:\d+>/i.test(string)) string = string.replace(/<a:[a-z0-9-_]+:\d+>/i, "<userAnimatedEmote>");
            // }
            if (/;[a-z0-9-_]*?;/i.test(string)){
                do {
                    //emote replacer
                    let eth = /;[a-z0-9-_]*?;/i.exec(string)[0]; //eth - emotes to handle
                    string = string.replace(eth, client.emoteHandler.find(eth.slice(1, -1)));
                } while (/;[a-z0-9-_]*?;/i.test(string));
            }
            return string;
        }
    });
}