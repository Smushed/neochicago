const messageHandler = require('../handlers/messageHandler');

module.exports = function (app) {
    app.get('/', (req, res) => {
        console.log(req.query)
        messageHandler.grabMessages();
        res.render('home');
    });
}