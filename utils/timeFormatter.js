let leadingZeroes = function(n){
    if (n<=9) return "0"+n;
    return n;
}

exports.leadingZeroes = leadingZeroes;

exports.leadSigleHex = function(n){
    if (parseInt(n, 16) < 16) return "0"+n;
    return n;
}

exports.leadHex = function(n){
    switch(n.length){
        case 1:return "00000"+n;
        case 2:return "0000"+n;
        case 3:return "000"+n;
        case 4:return "00"+n;
        case 5:return "0"+n;
        case 6:return n;
    }
}

exports.msFormat = function(n){
    if (n<=60000) return `${Math.floor(n/1000)}s`;
    if (n<=3600000) return `${Math.floor(n/60000)}m ${Math.floor(n/1000)-(Math.floor(n/60000)*60)}s`;
    if (n<=86400000) return `${Math.floor(n/3600000)}h ${Math.floor(n/60000)-(Math.floor(n/3600000)*60)}m`;
    return `${Math.floor(n/86400000)}d ${Math.floor(n/3600000)-(Math.floor(n/86400000)*24)}h`;
}

exports.dateFormat = function(date){
    return leadingZeroes(date.getDate())
    +"/"+leadingZeroes(date.getMonth()+1)
    +"/"+date.getFullYear()
    +", "+leadingZeroes(date.getHours())
    +":"+leadingZeroes(date.getMinutes())
    +":"+leadingZeroes(date.getSeconds());
}

exports.numeralSuffix = function(num){
    if(num%100 === 11 || num%100 === 12 || num%100 === 13) return 'th';
    else switch(num%10){
        case 1:return 'st';
        case 2:return 'nd';
        case 3:return 'rd';
        default:return 'th';
    }
}

exports.humanParser = function(timeStr){
    const regex = /(\d+)\s*([a-z]+)/gi;
    let res = 0;
    let m;

    while ((m = regex.exec(timeStr)) !== null){
        if (m.index === regex.lastIndex) regex.lastIndex++;
        switch(m[2]){
            case 's':
            case 'second':
            case 'seconds':
                res += parseInt(m[1]);
                break;
            case 'm':
            case 'minute':
            case 'minutes':
                res += parseInt(m[1]) * 60;
                break;
            case 'h':
            case 'hour':
            case 'hours':
                res += parseInt(m[1]) * 60 * 60;
                break;
            case 'd':
            case 'day':
            case 'days':
                res += parseInt(m[1]) * 60 * 60 * 24;
                break;
            case 'w':
            case 'week':
            case 'weeks':
                res += parseInt(m[1]) * 60 * 60 * 24 * 7;
                break;
        }
    }
    return res;
}

exports.round = function(n, k){
    let factor = 10**k;
    return Math.round(n*factor)/factor;
}

exports.snowflake = function(sf){
    //hard assume, that given snowflake is 100% valid
    const DiscordEpoch = 1420070400000;
    function getBinSlice(start, end){return parseInt(parseInt(sf).toString(2).slice(start, end), 2);}
    return {
        timestamp: DiscordEpoch+getBinSlice(0, -22),
        worker: getBinSlice(-22, -17),
        process: getBinSlice(-17, -12),
        increment: getBinSlice(-12)
    }
}