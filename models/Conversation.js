const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    M: [mongoose.Schema.Types.ObjectId], //Members
});

module.exports = mongoose.model(`Conversation`, ConversationSchema);