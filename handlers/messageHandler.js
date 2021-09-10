const db = require('../models');
const moment = require('moment');
const axios = require('axios');

const findOrCreateConvo = async (id1, id2) => {
    let convo = await db.Conversation.findOne({ '$and': [{ M: { '$in': [id1] } }, { M: { '$in': [id2] } }] });
    if (!convo) {
        convo = await db.Conversation.create({
            M: [id1, id2]
        });
    };
    return convo;
};

const pullMessages = (convoId) => {
    return new Promise(async (res, rej) => {
        res(await db.Message.find({ C: convoId }).sort({ D: 1 }).lean())
    });
};

const fillMessageUsers = (messageLog, user) => {
    const updatedLog = [];
    for (let i = 0; i < messageLog.length; i++) {
        updatedLog.push({
            M: messageLog[i].M,
            CU: (messageLog[i].S.toString() === user._id.toString() ? true : false)
        });
    };
    return updatedLog;
};

module.exports = {
    grabMessages: async (user, npc) => { //user and NPC might be flipped if an admin is using the carmack route
        const convo = await findOrCreateConvo(user._id, npc._id)
        const rawMessageLog = await pullMessages(convo._id);
        const messageLog = await fillMessageUsers(rawMessageLog, user);
        return { messageLog, ERUN: user.N, CHUN: npc.N, DID: user.DID };
    },
    erMessage: async (message, ERUN, CHUN) => {
        const user = await db.User.findOne({ N: ERUN }).exec();
        const npc = await db.User.findOne({ N: CHUN }).exec();
        console.log({ user, npc })

        const convo = await findOrCreateConvo(user._id, npc._id);

        const newDate = new Date();
        await db.Message.create({
            S: user._id,
            R: npc._id,
            M: message,
            D: newDate,
            C: convo._id
        });

        return 200;
    },
    convoList: async (user) => {
        const userConvos = await db.Conversation.find({ M: { '$in': [user._id] } });
        const convos = [];
        for (let i = 0; i < userConvos.length; i++) {
            const otherId = userConvos[i].M.filter(id => id.toString() !== user._id.toString());
            const otherUser = await db.User.findById(otherId).exec();

            const recentMessage = await db.Message.findOne({ C: userConvos[i]._id }).sort({ D: -1 });
            convos.push({
                ER: user.N,
                CH: otherUser.N,
                CHID: otherUser._id,
                RM: recentMessage.M,
                D: moment(recentMessage.D).add(20, 'y').format('MM/DD/YY HH:MM')
            });
            if (user.DID) {
                convos[i].ERID = user.DID;
            } else {
                convos[i].ERID = user._id;
            }
        }
        return convos;
    }
}