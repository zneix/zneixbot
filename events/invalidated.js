module.exports = () => {
    console.error(`{INVALIDATED} Discord token seems to be invalid, terminating!`);
    process.emit('SIGINT');
}