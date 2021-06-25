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
    M: String, //Message
    D: Date, //Date Sent
    C: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model(`Message`, MessageSchema);