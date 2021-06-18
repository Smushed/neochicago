const loginHandler = require("../handlers/loginHandler");

module.exports = function (app) {
    app.get('/api/login', async (req, res) => {
        const { id } = req.query;
        const response = await loginHandler.loginRequest(id);
        res.sendStatus(response);
    })
}