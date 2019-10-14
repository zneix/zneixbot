module.exports = (client, ocMessage) => {
    const time = require('../../utils/timeFormatter');
    const e =  require('../../utils/emoteHandler')(client);
    let colors = {
        start: 0x58fd18,
        abandon: 0x9066b9,
        lost: 0xc83526,
        win: 0xfcbd09
    };
    let blocks = {
        0: "void",
        2: "Kappa",
        4: "FeelsBadMan",
        8: "FeelsGoodMan",
        16: "KKona",
        32: "BibleThump",
        64: "LUL",
        128: "haHAA",
        256: "RareParrot",
        512: "forsenPls",
        1024: "gachiBASS",
        2048: "EZ"
    };
    let gameState = {
        win: false,
        gameover: false,
        freeSlots: 4,
        slots: {
            '11': 0,
            '12': 0,
            '13': 0,
            '14': 0,
            '21': 0,
            '22': 0,
            '23': 0,
            '24': 0,
            '31': 0,
            '32': 0,
            '33': 0,
            '34': 0,
            '41': 0,
            '42': 0,
            '43': 0,
            '44': 0
        },
        /*
        11 12 13 14
        21 22 23 24
        31 32 33 34
        41 42 43 44
        */
        score: 0
    };
    
    let buttons = [
        {
            emoji: '⬆',
            run: (user, message) => {
                if (canMoveV()) {
                    move('up', gameState);
                    updateEmbed(message);
                }
            }
        },
        {
            emoji: '⬇',
            run: (user, message) => {
                if (canMoveV()) {
                    move('down', gameState);
                    updateEmbed(message);
                }
            }
        },
        {
            emoji: '⬅',
            run: (user, message) => {
                if (canMoveH()) {
                    move('left', gameState);
                    updateEmbed(message);
                }
            }
        },  
        {
            emoji: '➡',
            run: (user, message) => {
                if (canMoveV()) {
                    move('right', gameState);
                    updateEmbed(message);
                }
            }
        },
        {
            emoji: '❌',
            run: (user, message) => {
                VILOSTZULUL(false);
            }
        }
    ];
    let embed = {
        color: colors.start,
        timestamp: ocMessage.createTimestamp,
        footer: {
            text: `${ocMessage.author.tag} | Playing, Score: ${gameState.score}`,
            icon_url: ocMessage.author.avatarURL
        }
    };
    return {
        buttons: buttons,
        embed: embed
    }
    //functions and util stuff
    function canMove(){
        if (!canMoveV() && !canMoveH()) return false;
        return true;
    }
    function canMoveV(){
        for (i=0;i<4;i++){
            for (a=0;a<4;a++){
                if (gameState.slots[a.toString()+i.toString()] === 0) return true;
            }
            for (a=0;a<4-1;a++){
                if (gameState.slots[a.toString()+i.toString()] === gameState.slots[(a+1).toString()+i.toString()]) return true;
            }
        }
        return false;
    }
    function canMoveH(){
        for (i=0;i<4;i++){
            for (a=0;a<4;a++){
                if (gameState.slots[i.toString()+a.toString()] === 0) return true;
            }
            for (a=0;a<4-1;a++){
                if (gameState.slots[i.toString()+a.toString()] === gameState.slots[i.toString()+(a+1).toString()]) return true;
            }
        }
        return false;
    }

    function newBlock(){return Math.floor(Math.random()*100+1)<=90?2:4;} //determines whether new block should be a 'two' or 'four'
    function rng4(){return Math.floor(Math.random()*4+1);} //random number between 1-4
    function newSlot(){return rng4().toString()+rng4().toString();} //random slot in game 4x4 square
    
    function move(direction){
        let rand = false;
        //vertical
        if (direction === 'up' || direction === 'down') {
            //up
            /*
            11 12 13 14
            21 22 23 24
            31 32 33 34
            41 42 43 44
            */
            if (direction === 'up') {
                for (x=0;x<4;x++){
                    if (gameState.slots["1"+x.toString()] === gameState.slots["2"+x.toString()] && gameState.slots["2"+x.toString()] === gameState.slots["3"+x.toString()] && gameState.slots["3"+x.toString()] === gameState.slots["4"+x.toString()]){
                        gameState.slots["1"+x.toString()] *= 2;
                        gameState.slots["2"+x.toString()] *= 2;
                        gameState.slots["3"+x.toString()] = 0;
                        gameState.slots["4"+x.toString()] = 0;
                    }
                    else {
                        for (y=0;y<4-1;y++){
                            if (gameState.slots[y.toString()+x.toString()] === gameState.slots[(y+1).toString()+x.toString()]) merge((y.toString()+x.toString()), ((y+1).toString()+x.toString()), direction);
                            if (gameState.slots[y.toString()+x.toString()] === 0) gameState.slots[y.toString()+x.toString()] = gameState.slots[(y+1).toString()+x.toString()];
                        }
                    }
                }
            }
            //down
            else {
                for (x=0;x<4;x++){
                    if (gameState.slots["1"+x.toString()] === gameState.slots["2"+x.toString()] && gameState.slots["2"+x.toString()] === gameState.slots["3"+x.toString()] && gameState.slots["3"+x.toString()] === gameState.slots["4"+x.toString()]){
                        gameState.slots["1"+x.toString()] = 0;
                        gameState.slots["2"+x.toString()] = 0;
                        gameState.slots["3"+x.toString()] *= 2;
                        gameState.slots["4"+x.toString()] *= 2;
                    }
                    for (y=0;y<4-1;y++){
                        if (gameState.slots[(4-(y-1)).toString()+x.toString()] === gameState.slots[(4-y).toString()+x.toString()]) merge(((4-(y-1)).toString()+x.toString()), ((4-y).toString()+x.toString()), direction);
                        if (gameState.slots[(4-(y-1)).toString()+x.toString()] === 0) gameState.slots[(4-(y-1)).toString()+x.toString()] = gameState.slots[(4-y).toString()+x.toString()];
                    }
                }
            }
        }
        //horizontal
        else {
            //left
            if (direction === 'left') {
                for (x=0;x<4;x++){
                    if (gameState.slots[x.toString()+"1"] === gameState.slots[x.toString()+"2"] && gameState.slots[x.toString()+"2"] === gameState.slots[x.toString()+"3"] && gameState.slots[x.toString()+"3"] === gameState.slots[x.toString()+"4"]){
                        gameState.slots[x.toString()+"1"] *= 2;
                        gameState.slots[x.toString()+"2"] *= 2;
                        gameState.slots[x.toString()+"3"] = 0;
                        gameState.slots[x.toString()+"4"] = 0;
                    }
                    for (y=0;y<4-1;y++){
                        if (gameState.slots[x.toString()+y.toString()] === gameState.slots[x.toString()+(y+1).toString()]) merge((x.toString()+y.toString()), (x.toString()+(y+1).toString()), direction);
                        if (gameState.slots[x.toString()+y.toString()] === 0) gameState.slots[x.toString()+y.toString()] = gameState.slots[x.toString()+(y+1).toString()];
                    }
                }
            }
            //right
            else {
                for (x=0;x<4;x++){
                    if (gameState.slots[x.toString()+"1"] === gameState.slots[x.toString()+"2"] && gameState.slots[x.toString()+"2"] === gameState.slots[x.toString()+"3"] && gameState.slots[x.toString()+"3"] === gameState.slots[x.toString()+"4"]){
                        gameState.slots[x.toString()+"1"] = 0;
                        gameState.slots[x.toString()+"2"] = 0;
                        gameState.slots[x.toString()+"3"] *= 2;
                        gameState.slots[x.toString()+"4"] *= 2;
                    }
                    for (y=0;y<4-1;y++){
                        if (gameState.slots[x.toString()+(4-(y-1)).toString()] === gameState.slots[x.toString()+(4-y).toString()]) merge((x.toString()+(4-(y-1)).toString()), (x.toString()+(4-y).toString()), direction);
                        if (gameState.slots[x.toString()+(4-(y-1)).toString()] === 0) gameState.slots[x.toString()+(4-(y-1)).toString()] = gameState.slots[x.toString()+(4-y).toString()];
                    }
                }
            }
        }

        addBlock();
        if (!canMove()) {
            gameState.gameover = true;
        }
    }
    function merge(block1, block2, way){
        switch(way){
            case 'up':
                gameState.slots[block1] *= 2;
                gameState.slots[block2] = 0;
            break;
            case 'down':
                gameState.slots[block1] = 0;
                gameState.slots[block2] *= 2;
            break;
            case 'left':
                gameState.slots[block1] *= 2;
                gameState.slots[block2] = 0;
            break;
            case 'right':
                gameState.slots[block1] = 0;
                gameState.slots[block2] *= 2;
            break;
        }
        gameState.score += block1*2;
    }
    function addBlock(){
        do {
            let test = newSlot();
            if (gameState.slots[test] != 0) continue;
            gameState.slots[test] = newBlock();
            gameState.freeSlots = gameState.freeSlots - 1;
            return;
        } while (true);
    }
    function updateEmbed(message){
        if (gameState.gameover) VILOSTZULUL(true);
        /*
        11 12 13 14
        21 22 23 24
        31 32 33 34
        41 42 43 44
        */
        embed.description =
        `${e.asset(blocks[gameState.slots["11"]])}${e.asset(blocks[gameState.slots["12"]])}${e.asset(blocks[gameState.slots["13"]])}${e.asset(blocks[gameState.slots["14"]])}`+"\n"+
        `${e.asset(blocks[gameState.slots["21"]])}${e.asset(blocks[gameState.slots["22"]])}${e.asset(blocks[gameState.slots["23"]])}${e.asset(blocks[gameState.slots["24"]])}`+"\n"+
        `${e.asset(blocks[gameState.slots["31"]])}${e.asset(blocks[gameState.slots["32"]])}${e.asset(blocks[gameState.slots["33"]])}${e.asset(blocks[gameState.slots["34"]])}`+"\n"+
        `${e.asset(blocks[gameState.slots["41"]])}${e.asset(blocks[gameState.slots["42"]])}${e.asset(blocks[gameState.slots["43"]])}${e.asset(blocks[gameState.slots["44"]])}`;
        embed.timestamp = new Date();
        embed.footer.text = `${ocMessage.author.tag} | Playing, Score: ${gameState.score}`;
        message.edit({embed:embed});
    }
    function VILOSTZULUL(boolLeft){
        client.RCHandler.removeMenu(message.id);
        message.clearReactions();
        //embed editing thing
        embed.color = boolLeft?colors.abandon:colors.lost;
        embed.footer = {
            text: `${ocMessage.author.tag} | ${boolLeft?colors.abandon:colors.lost}, Score: ${gameState.score}`
        }
        message.edit({embed:embed});
    }
}
