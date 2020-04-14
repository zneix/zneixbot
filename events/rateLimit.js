module.exports = rl => {
    console.warn(`{rateLimit} ${rl.ms}ms, reqs: ${rl.limit}, method: ${rl.method}, route: ${rl.route}, path: ${rl.path}`);
}