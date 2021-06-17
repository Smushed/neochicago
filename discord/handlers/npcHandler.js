const db = require('../../models');

module.exports = {
    createNPC: (name) => {
        const newNPC = {
            N: name,
            P: false
        }
        db.User.create(newNPC);
    }
}