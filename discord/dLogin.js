module.exports = function (client) {
    client.once('ready', () => {
        client.user.setActivity('in NeoChicago | .help');
        console.log('Discord Bot Launched');
    });
}