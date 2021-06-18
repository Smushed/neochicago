
const genericMessage =
{
    S: '123456',
    R: '456789',
    M: 'This is a message',
    D: new Date('06/12/2021 16:20:00')
}

const sentMessage =
{
    S: '456789',
    R: '123456',
    M: 'Sent Message',
    D: new Date('06/12/2021 16:20:00')
}

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
    }
}