const messageHandler = require('../handlers/messageHandler');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        res.render('home');
    });

    app.get('/er/:discordId', async (req, res) => {
        const { discordId } = req.params;
        const convos = await messageHandler.grabConversations(discordId);
        if (convos === false) { res.render('fourOFour') };
        console.log(convos)
        res.render('erHomepage', { convos });
    });

    app.get('er/:playerId/ch/:npcId', (req, res) => {

    });

    app.get('/132149821728358401', (req, res) => {
        console.log(`admin`);
        res.render('admin');
    });

    app.get('*', function (req, res) {
        res.render('fourOFour')
    })
}