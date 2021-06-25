const db = require('../models');
const moment = require('moment');

module.exports = {
    grabMessages: async (playerId, npcId) => {
        const messageLog = [];
        for (let i = 0; i < 15; i++) {
            // if (playerId === genericMessage.S)
            messageLog.push(genericMessage)
            messageLog.push(sentMessage)
        };
        return messageLog;
        // const user = await db.User.findOne({ U: 'bullshit' });
    },
    initMessages: () => {
        // db.User.create({})
        // db.Message
    },
    grabConversations: async (discordId) => {
        const user = await db.User.findOne({ DID: discordId }).exec();
        if (!user) {
            return false;
        };

        const convos = await db.Conversation.find({ M: { '$in': [user._id] } });

        const convosForDisplay = [];
        for (let i = 0; i < convos.length; i++) {
            const otherId = convos[i].M.filter(id => id.toString() !== user._id.toString());
            const otherUser = await db.User.findById(otherId).exec();

            const recentMessage = await db.Message.findOne({ C: convos[i]._id }).sort({ D: -1 });
            convosForDisplay.push({
                ER: user.N,
                CH: otherUser.N,
                RM: recentMessage.M,
                D: moment(recentMessage.D).add(20, 'y').format('MM/DD/YY HH:MM')
            });
        }

        return convosForDisplay;
    }
}