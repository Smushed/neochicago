const messageHandler = require("../handlers/messageHandler");

module.exports = function (app, client) {
    app.post('/message', async (req, res) => {
        const { message, ERUN, CHUN } = req.body;
        const response = await messageHandler.erMessage(message, ERUN, CHUN);
        res.sendStatus(response);
    });

}