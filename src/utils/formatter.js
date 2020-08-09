//numeric operations
exports.leadZero = function(n){ return n < 10 ? '0'+n : n.toString(); }
exports.numSuffix = function(n){
    if ([11, 12, 13].includes(n%100)) return 'th';
    else switch(n%10){
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}
exports.round = function(n, k){
    let factor = 10**k;
    return Math.round(n*factor)/factor;
}
//date and time operations
exports.dateFormat = function(date){ return `${exports.leadZero(date.getDate())}/${exports.leadZero(date.getMonth()+1)}/${exports.leadZero(date.getFullYear())}`; }
exports.hourFormat = function(date){ return `${exports.leadZero(date.getHours())}:${exports.leadZero(date.getMinutes())}:${exports.leadZero(date.getSeconds())}`; }
exports.msToHuman = function(n, ln){
    n = parseInt(n);
    let str = [];
    if (n >= 1000 * 60 * 60 * 24 * 365) cut(1000 * 60 * 60 * 24 * 365, 'y');
    // if (n >= 1000 * 60 * 60 * 24 * 30) cut(1000 * 60 * 60 * 24 * 30, 'mo'); //decided to not use that for now, because months have different amounts of days
    if (n >= 1000 * 60 * 60 * 24) cut(1000 * 60 * 60 * 24, 'd');
    if (n >= 1000 * 60 * 60) cut(1000 * 60 * 60, 'h');
    if (n >= 1000 * 60) cut(1000 * 60, 'm');
    if (n >= 1000) cut(1000, 's');
    if (!str.length && n < 1000) cut(1, 'ms'); //only when there's no other time units specified
    //execution part
    function cut(v, c){
        str.push(Math.floor(n / v)+c);
        n = n % v;
    }
    return str.slice(0, ln || 420).join(' ');
}
exports.humanToSec = function(timeStr){
    //parsing human-readable-like strings to amount of seconds
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
            case 'y':
            case 'year':
            case 'years':
                res += parseInt(m[1]) * 60 * 60 * 24 * 365;
                break;
        }
    }
    return res;
}
//misc convertions
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
exports.bytesToUnits = function(n){
    n = parseInt(n);
    let str = [];
    if (n >= 1024 * 1024 * 1024) cut(1024 * 1024 * 1024, 'GB');
    if (n >= 1024 * 1024) cut(1024 * 1024, 'MB');
    if (n >= 1024) cut(1024, 'kB');
    if (!str.length && n < 1024) cut(1, 'B');
    function cut(v, c){
        str.push(Math.floor(n / v)+c);
        n = n % v;
    }
    return str.join(' ');
}