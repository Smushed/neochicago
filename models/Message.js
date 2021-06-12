const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    S: { //Sender
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    R: {//Receiver
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    M: String, //String
    D: Date //Date Sent
});

module.exports = mongoose.model(`Message`, MessageSchema);