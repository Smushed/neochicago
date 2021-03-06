const db = require('../../models');

module.exports = {
    createNPC: async (name) => {
        const isDupe = await db.User.findOne({ N: name }).exec();
        if (isDupe) { return `${name} already exists!` };
        const newNPC = {
            N: name,
            P: false
        };
        const createdNPC = await db.User.create(newNPC);
        return `${createdNPC.N} created`;
    },
    grabUsers: async () => {
        const allUsers = await db.User.find().exec();
        let response = 'All Users\n';
        for (const user of allUsers) {
            if (user.N !== 'Smushed') {
                response += `\n${user.N} - ${process.env.URL}/${process.env.BIG_ADMIN}/${user._id}`;
            }
        }
        return response;
    }
}