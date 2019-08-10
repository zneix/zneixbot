exports.leadingZeroes = function(n){
    if (n<=9) return "0"+n;
    return n;
}

function leadingZeroes(n){
    if (n<=9) return "0"+n;
    return n;
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