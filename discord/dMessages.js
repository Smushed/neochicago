require("dotenv").config();
const guildHandler = require('./handlers/guildHandler');
const npcHandler = require('./handlers/npcHandler');
const pingHandler = require('./handlers/pingHandler');

module.exports = function (client) {
    client.on('message', async (message) => {
        if (message.content.startsWith('acmd')) {

            if (message.author.id !== process.env.KEVIN) {
                message.author.send('**ACCESS DENIED**');
                return;
            };

            const [x, cmdName, arg1, arg2, arg3] = message.content.split('+');
            if (!arg1) { return; };

            switch (cmdName) {
                case 'cnpc': {
                    const response = await npcHandler.createNPC(arg1); //arg1 should be name of NPC
                    message.author.send(response);
                    break;
                } case 'cmsg': {
                    const response = await pingHandler.writeMessageToPC(client, arg1, arg2, arg3);
                    message.author.send(response);
                    break;
                } default: {
                    message.author.send('Unknown Command, Choomba');
                }
            };

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
            } default: {
                pingHandler.unknownCommand(message);
            };
        }
    });
}