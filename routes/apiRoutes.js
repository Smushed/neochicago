const characterHandler = require("../handlers/characterHandler");
const messageHandler = require("../handlers/messageHandler");

module.exports = function (app) {
    app.post('/message', async (req, res) => {
        const { message, ERUN, CHUN } = req.body;
        const response = await messageHandler.erMessage(message, ERUN, CHUN);
        res.sendStatus(response);
    });

    app.get('/admin', async (req, res) => {
        const { pass } = req.query;
        if (pass === process.env.ADMIN_PASS) {
            //Get all the players from here
            //Grab all the conversations with the players
            //Grab all the NPC data
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    });
}