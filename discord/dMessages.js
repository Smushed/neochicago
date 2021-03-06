require('dotenv').config();
const userHandler = require('./handlers/userHandler');
const pingHandler = require('./handlers/pingHandler');

module.exports = function (client) {
    client.on('message', async (message) => {
        if (message.content.startsWith('acmd')) {

            if (message.author.id !== process.env.KEVIN) {
                message.author.send('**ACCESS DENIED**');
                return;
            };

            const [x, cmdName, arg1, arg2, arg3] = message.content.split('+');
            if (!arg1) {
                message.author.send('-\nacmd+cnpc+NPC_NAME  -Create NPC\nacmd+cmsg+NPC_SENDER_NAME+PC_REAL_NAME+MESSAGE  -Send Message\nacmd+lookup+all  -Lookup Characters\nacmd+ping+PC_REAL_NAME');
                return;
            };

            switch (cmdName) {
                case 'cnpc': {
                    const response = await userHandler.createNPC(arg1); //arg1 should be name of NPC
                    message.author.send(response);
                    break;
                } case 'cmsg': {
                    const response = await pingHandler.writeMessageToPCFromCMD(client, arg1, arg2, arg3);
                    message.author.send(response);
                    break;
                } case 'lookup': {
                    const response = await userHandler.grabUsers();
                    message.author.send(response);
                    break;
                } case 'ping': {
                    const response = await pingHandler.sendAgentMessage(client, arg1, arg2);
                    message.author.send(response);
                    break;
                } default: {
                    message.author.send('Unknown Command, Choomba');
                }
            };

        };

        if (!message.content.startsWith('.')) { return }
        const [command] = message.content.split(' ');
        switch (command) {
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
            } case '.8': {
                pingHandler.eightBall(message);
                break;
            } case '.recent': {
                pingHandler.getRecent(message);
                break;
            } case '.reply': {
                pingHandler.replyToLast(message, client);
                break;
            } default: {
                pingHandler.unknownCommand(message);
            };
        }
    });
}