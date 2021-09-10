const characterHandler = require('../handlers/characterHandler');
require('dotenv').config();

module.exports = function (app) {
    app.get('/', async (req, res) => {
        res.render('home');
    });

    app.get('/er/:discordId', async (req, res) => {
        const { discordId } = req.params;
        const display = await characterHandler.grabConversations(discordId);
        if (display === false) { res.render('fourOFour') };
        res.render('erHomepage', display);
    });

    app.get('/er/:discordId/ch/:npcId', async (req, res) => {
        const { discordId, npcId } = req.params;
        const display = await characterHandler.grabMessagesByDiscord(discordId, npcId);
        if (display === false) { res.render('fourOFour') };

        res.render('messages', display);
    });

    app.get(`/${process.env.BIG_ADMIN}`, async (req, res) => {
        const display = await characterHandler.grabAllCharacters();
        res.render('admin', display);
    });

    app.get(`/${process.env.BIG_ADMIN}/:id`, async (req, res) => {
        const { id } = req.params;
        const display = await characterHandler.grabConvosByMongoId(id);
        res.render('erHomepage', display);
    });

    app.get(`/${process.env.BIG_ADMIN}/:ERId/:NPCId`, async (req, res) => {
        const { ERId, NPCId } = req.params;
        let disReceiver = await client.users.fetch(ERId);
        const display = await characterHandler.grabMessagesForAdmin(ERId, NPCId);
        res.render('messages', display);
    });

    app.get('*', function (req, res) {
        res.render('fourOFour');
    });
}