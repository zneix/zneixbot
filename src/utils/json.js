let fs = require('fs');
exports.exists = function(path){
    return fs.existsSync(path);
}
exports.read = function(path){
    if (!exports.exists(path)) return null;
    return JSON.parse(fs.readFileSync(path).toString());
}
exports.write = function(path, jsondata){
    if (exports.exists(path)) return null;
    fs.writeFileSync(path, JSON.stringify(jsondata, null, 4));
}