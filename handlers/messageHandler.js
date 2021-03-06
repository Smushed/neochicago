require('dotenv').config();
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
    erMessage: async (message, ERUN, CHUN, client) => {
        const user = await db.User.findOne({ N: ERUN }).exec();
        const npc = await db.User.findOne({ N: CHUN }).exec();

        const convo = await findOrCreateConvo(user._id, npc._id);

        const newDate = new Date();
        await db.Message.create({
            S: user._id,
            R: npc._id,
            M: message,
            D: newDate,
            C: convo._id
        });

        if (user.P) {
            let discord = await client.users.fetch(process.env.KEVIN);
            discord.send(`User ${user.N} sent ${npc.N} a new message\n\nhttp://neochicago.network/carmack/${user.DID}/${npc._id}`);
        } else {
            //A bit confusing here, but this is if admin sent a message
            //NPC is the player in the game and User is the character that sent the message
            let discord = await client.users.fetch(npc.DID);
            discord.send(`You've received a message from ${user.N}\n - ${message}\n\nhttp://neochicago.network/er/${npc.DID}/ch/${user._id}\n.reply [Your Message]   - Send a reply directly`);
        }

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