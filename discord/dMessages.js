const guildHandler = require('./handlers/guildHandler');
const npcHandler = require('./handlers/npcHandler');
const pingHandler = require('./handlers/pingHandler');

module.exports = function (client) {
    client.on('message', message => {
        if (message.content.startsWith('a_cmd')) {
            const [x, cmdName, arg1, arg2] = message.content.split('-');
            if (cmdName === 'c_npc') {
                npcHandler.createNPC(arg1); //arg1 should be name of NPC
            }
            // pingHandler.pingRyan(client);
            // guildHandler.saveUsers()
        };

        if (!message.content.startsWith('.')) { return }

        switch (message.content) {
            case '.help': {
                pingHandler.help(message);
                break;
            } case '.id': {
                pingHandler.replyId(message);
                break;
            } case '.link': {
                pingHandler.linkWebsite(message);
                break;
            } case '.messages': {
                pingHandler.messagePage(message);
                break;
            }
        }
    });
}