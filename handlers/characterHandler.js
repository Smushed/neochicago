const db = require('../models');
const messageHandler = require('./messageHandler');

module.exports = {
    grabAllCharacters: async () => {
        const allUsers = await db.User.find().exec();
        const players = [];
        const NPCs = [];
        for (const user of allUsers) {
            if (user.P) {
                players.push(user.toJSON());
            } else {
                NPCs.push(user.toJSON());
            }
        }
        return { players, NPCs };
    },
    grabConvosByMongoId: async (id) => {
        const user = await db.User.findById(id).exec();
        const convos = await messageHandler.convoList(user);
        return { convos, UN: user.N, A: true };
    },
    adminConversations: async function (id) {
        const convos = await this.grabConvos(id);
    },
    grabConversations: async function (discordId) {
        const user = await db.User.findOne({ DID: discordId }).exec();
        if (!user) { return false; };

        const convos = await messageHandler.convoList(user, discordId);

        return { convos, UN: user.N, A: false };
    },
    grabMessagesForAdmin: async function (pcId, npcId) {
        let user = await db.User.findOne({ DID: pcId }).exec(); //If we are viewing from a perspective of a user then search by discordId, otherwise it's mongooseId
        if (!user) {
            user = await db.User.findById(pcId).exec();
        };
        const npc = await db.User.findById(npcId).exec();
        if (!npc) { return false };

        return await messageHandler.grabMessages(npc, user);
    },
    grabMessagesByDiscord: async function (discordId, npcId) {
        const user = await db.User.findOne({ DID: discordId }).exec();
        if (!user) { return false };
        const npc = await db.User.findById(npcId).exec();
        if (!npc) { return false };

        return await messageHandler.grabMessages(user, npc);
    }
}