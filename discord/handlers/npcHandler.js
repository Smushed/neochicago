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
    }
}