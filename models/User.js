const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    N: { //Name. They can change and set this themselves
        type: String,
        required: true,
    },
    P: { //Is Player
        type: Boolean,
        required: true
    },
    DID: String, //DiscordId
    DUN: String, //Discord Name
    LK: String, //LegendKeeper Link (for NPCs)
});

module.exports = mongoose.model(`User`, UserSchema);