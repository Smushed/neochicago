const messageHandler = require('../handlers/messageHandler');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        // const { erid: playerId, nid: npcId } = req.query;
        // if (!playerId || !npcId) {
        //     res.render('fourOFour');
        //     return;
        // };
        // const messageLog = await messageHandler.grabMessages(playerId, npcId);
        res.render('home');
    });

    app.get('/er/:playerId', (req, res) => {

    });

    app.get('er/:playerId/n/:npcId', (req, res) => {

    });

    app.get('/132149821728358401', (req, res) => {
        console.log(`admin`);
        res.render('admin');
    });

    app.get('*', function (req, res) {
        res.render('fourOFour')
    })
}