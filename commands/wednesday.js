exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Checks if it's wednesday, my dude. (based on UK (GMT 0) time, my mate)`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let myDudes = [
            'https://www.youtube.com/watch?v=9K4-jllrPrE',
            'https://www.youtube.com/watch?v=bbat6cvgEJ8',
            'https://www.youtube.com/watch?v=Oct2xKMGOno',
            'https://www.youtube.com/watch?v=DREDJ4fkz-g',
            'https://www.youtube.com/watch?v=gxm5SwfkwcI',
            'https://www.youtube.com/watch?v=oVxFk_IIB2o',
            'https://www.youtube.com/watch?v=SePVlroq6AI',
            'https://www.youtube.com/watch?v=JHO61_wDC30',
            'https://www.youtube.com/watch?v=EBNEPil4da0',
            'https://www.youtube.com/watch?v=pXv4zQ6dYPQ',
            'https://www.youtube.com/watch?v=hzGQSlrB1_o',
            'https://www.youtube.com/watch?v=Y_xlWdgi1ew',
            'https://www.youtube.com/watch?v=szqNmefKXxc',
            'https://www.youtube.com/watch?v=OzQ-KvxLVT0',
            'https://www.youtube.com/watch?v=zl6phK1mXC4',
            'https://www.youtube.com/watch?v=7aTtNNjIyi4',
            'https://www.youtube.com/watch?v=1CH-7qjz4D4',
            'https://www.youtube.com/watch?v=YSDAAh6Lps4',
            'https://www.youtube.com/watch?v=fyJGKEswuSc',
            'https://www.youtube.com/watch?v=csqJK8wwaHw',
            'https://www.youtube.com/watch?v=KSwnFzlPEuY',
            'https://www.youtube.com/watch?v=aew9WTLqjDc',
            'https://www.youtube.com/watch?v=m2Z0CyuyfMI',
            'https://www.youtube.com/watch?v=VaPMUACYWww',
            'https://www.youtube.com/watch?v=_87k7gxeVsw',
            'https://www.youtube.com/watch?v=3RSL5k3yZOM',
            'https://www.youtube.com/watch?v=VXc47lVx7Eo',
            'https://www.youtube.com/watch?v=0W51GIxnwKc',
            'https://www.youtube.com/watch?v=VfaNCw2bF48',
            'https://www.youtube.com/watch?v=It8RbsGIe48',
            'https://www.youtube.com/watch?v=NBPlPowAsNc',
            'https://www.youtube.com/watch?v=IaE0g3oVIZ0',
            'https://www.youtube.com/watch?v=VzigPnZ8OYE',
            'https://www.youtube.com/watch?v=meuYC7FP7HU',
            'https://www.youtube.com/watch?v=N3e7G9OxfhI',
            'https://www.youtube.com/watch?v=IR0QUwGmo4A',
            'https://www.youtube.com/watch?v=ESNBnxtpKqI',
            'https://www.youtube.com/watch?v=036ItQLi-sQ',
            'https://www.youtube.com/watch?v=Kz26jod9-cQ',
            'https://www.youtube.com/watch?v=LrleLDD8CJM',
            'https://www.youtube.com/watch?v=ZHS5yAwApUs',
            'https://www.youtube.com/watch?v=PE8GlPpuLuY',
            'https://www.youtube.com/watch?v=4Sr5pRpDZMk',
            'https://www.youtube.com/watch?v=qCsYa8PeVfU',
            'https://www.youtube.com/watch?v=-R40VcLKyIw',
            'https://www.youtube.com/watch?v=7dr2s59XnBE',
            'https://www.youtube.com/watch?v=iTl1l3GFMJ8',
            'https://www.youtube.com/watch?v=In9Bs1wiF5s',
            'https://www.youtube.com/watch?v=zHpFuOlPrlQ',
            'https://www.youtube.com/watch?v=Xf_wuAQ-t44',
            'https://www.youtube.com/watch?v=frNFBv2QIoE',
            'https://www.youtube.com/watch?v=PAnKl7862qc'
        ];
        let rng = Math.floor(Math.random()*myDudes.length);
        let time = new Date().getUTCDay();
        let Pepega;
        switch(time){
            case 1: Pepega = 'Two more days, my dude '+client.emoteHandler.find("OkayChamp");break;
            case 2: Pepega = 'Tommorow, my dude '+client.emoteHandler.find("PagChomp");break;
            case 3: Pepega = `**It is Wednesday, my dude ${client.emoteHandler.find("Wednesday")} ${client.emoteHandler.find("forsenPls")}**\nHere's you daily wednesday: <${myDudes[rng]}>`;break;
            case 4: Pepega = 'I hate Thursdays '+client.emoteHandler.find("NotLikeThis");break;
            case 5: Pepega = client.emoteHandler.find("GachiPls")+' weekend, my dude';break;
            case 6: Pepega = 'It is Weekend my dude '+client.emoteHandler.find("EZ");break;
            case 0: Pepega = 'It is Weekend my dude '+client.emoteHandler.find("EZ");break;
        }
        if (!Pepega) Pepega = 'It is not Wednesday, my dude '+client.emoteHandler.find("FeelsBadMan"); //just in case something would go wrong
        message.reply(Pepega);
    });
}