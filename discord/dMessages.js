const guildHandler = require('./handlers/guildHandler');
const npcHandler = require('./handlers/npcHandler');
const pingHandler = require('./handlers/pingHandler');

module.exports = function (client) {
    client.on('message', message => {
        if (message.content === '.help') {
            pingHandler.help(message);
            return;
        };

        if (message.channel.type !== 'dm') {
            return;
        };

        if (message.content === '.id') {
            pingHandler.replyId(message);

        } else if (message.content.startsWith('a_cmd')) {
            const [x, cmdName, arg1, arg2] = message.content.split('-');
            if (cmdName === 'c_npc') {
                npcHandler.createNPC(arg1); //arg1 should be name of NPC
            }
            // pingHandler.pingRyan(client);
            // guildHandler.saveUsers()
        } else {
        };
    });
}