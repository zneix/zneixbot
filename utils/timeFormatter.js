let leadingZeroes = function(n){
    if (n<=9) return "0"+n;
    return n;
}

exports.leadingZeroes = leadingZeroes;

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