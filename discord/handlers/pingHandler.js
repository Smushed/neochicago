const helpMessage = '*People who need help shouldn\'t be on the net.* \n.link - Link to Kairos Website\n.id - get ID for Kairos \n.messages - Your Messages';
const unknownCommand = '*Be careful punching in random commands, you never know what\'s behind the next door.*\n.help for list of commands.';
const Discord = require('discord.js');
const db = require('../../models');
const axios = require('axios');

const createEmbed = (title, url, description = '') => {
    return new Discord.MessageEmbed()
        .setTitle(title)
        .setURL(url)
        .setDescription(description);
};

module.exports = {
    help: (message) => {
        message.author.send(`${helpMessage}`);
    },
    replyId: (message) => {
        message.author.send(message.author.id);
    },
    messagePage: async (message) => {
        const user = await db.User.findOne({ DID: message.author.id });
        const embedLink = createEmbed(`${user.N} Message Hub`, `http://neochicago.network/er/${message.author.id}`);
        message.author.send('Here you are, Edgerunner', embedLink)
    },
    linkWebsite: (message) => {
        const embedLink = createEmbed('Kairos Network', 'http://neochicago.network', 'NeoChicago\'s Edgerunner Hub');
        message.author.send('', embedLink)
    },
    unknownCommand: (message) => {
        message.author.send(unknownCommand);
    },
    writeMessageToPC: async (client, sender, receiver, message) => {
        //Discord Info
        const recId = process.env[receiver.toUpperCase()];
        let disReceiver;
        try {
            disReceiver = await client.users.fetch(recId);
        } catch {
            return 'Discord for Receiver is not found';
        };

        //MongoDB
        const dbSend = await db.User.findOne({ N: sender }).exec();
        if (!dbSend) {
            return 'DB Sender is not found';
        };
        const dbRec = await db.User.findOne({ DUN: disReceiver.username });
        if (!dbRec) {
            return 'DB Receiver is not found';
        };

        //Conversation
        let convo = await db.Conversation.findOne({ M: { '$in': [dbRec._id, dbSend._id] } });
        if (!convo) {
            convo = await db.Conversation.create({
                M: [dbRec._id, dbSend._id]
            });
        };

        //Date
        const timeJSON = await axios.get(`http://worldtimeapi.org/api/timezone/America/Chicago`);

        await db.Message.create({
            S: dbSend._id,
            R: dbRec._id,
            M: message,
            D: timeJSON.data.datetime,
            C: convo._id
        })

        disReceiver.send(`You have received a new message from ${dbSend.N}\nhttp://neochicago.network/er/${recId}/ch/${dbSend._id}`);

        return `Message has been sent to ${disReceiver.username}`;
    }
};