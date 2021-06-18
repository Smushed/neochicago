const db = require('../models')

module.exports = {
    loginRequest: async (id) => {
        const user = await db.User.findOne({ DID: id }).exec();
        if (!user) { return 500 }
    }
}