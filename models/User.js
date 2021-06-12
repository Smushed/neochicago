const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    N: { //Name
        type: String,
        required: true,
    },
    P: { //Is Player
        type: Boolean,
        required: true
    },
    AI: Boolean, //Is AI
    D: String //Discord

});

module.exports = mongoose.model(`User`, UserSchema);