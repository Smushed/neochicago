const db = require('../models');
const moment = require('moment');

const findOrCreateConvo = async (id1, id2) => {
    let convo = await db.Conversation.findOne({ '$and': [{ M: { '$in': [id1] } }, { M: { '$in': [id2] } }] });
    if (!convo) {
        convo = await db.Conversation.create({
            M: [id1, id2]
        });
    };
    return convo;
};

module.exports = {
    grabMessages: async (discordId, npcId) => {
        const user = await db.User.findOne({ DID: discordId }).exec();
        if (!user) { return false };
        const npc = await db.User.findById(npcId).exec();
        if (!npc) { return false };

        const convo = await findOrCreateConvo(user._id, npcId)
        const messageLog = await db.Message.find({ C: convo._id }).lean();
        return { messageLog, ERUN: user.N, CHUN: npc.N };
    },
    initMessages: () => {
        // db.User.create({})
        // db.Message
    },
    grabConversations: async (discordId) => {
        const user = await db.User.findOne({ DID: discordId }).exec();
        if (!user) { return false; };

        const userConvos = await db.Conversation.find({ M: { '$in': [user._id] } });

        const convos = [];
        for (let i = 0; i < userConvos.length; i++) {
            const otherId = userConvos[i].M.filter(id => id.toString() !== user._id.toString());
            const otherUser = await db.User.findById(otherId).exec();

            const recentMessage = await db.Message.findOne({ C: userConvos[i]._id }).sort({ D: -1 });
            convos.push({
                ER: user.N,
                ERID: discordId,
                CH: otherUser.N,
                CHID: otherUser._id,
                RM: recentMessage.M,
                D: moment(recentMessage.D).add(20, 'y').format('MM/DD/YY HH:MM')
            });
        }

        return { convos, UN: user.N };
    }
}