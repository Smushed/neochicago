const Discord = require('discord.js');
const db = require('../../models');
const axios = require('axios');

const helpMessage = 'Kairos Response -\n*People who need help shouldn\'t be on the net.* \n.link - Link to Kairos Website\n.id - get ID for Kairos \n.messages - Your Messages\n.8 Consult Magic';
const unknownCommand = '*Be careful punching in random commands, you never know what\'s behind the next door.*\n.help for Kairos commands.';
const agentMessage = 'Reaching out to Kairos...';
const eightBall = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes, definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Reply hazy try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    'Don\'t count on it',
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful'
]

const createEmbed = (title, url, description = '') => {
    return new Discord.MessageEmbed()
        .setTitle(title)
        .setURL(url)
        .setDescription(description);
};

module.exports = {
    help: (message) => {
        message.author.send(agentMessage);
        setTimeout(() => message.author.send(helpMessage), 1500);
    },
    replyId: (message) => {
        message.author.send(message.author.id);
    },
    messagePage: async (message) => {
        const user = await db.User.findOne({ DID: message.author.id });
        const embedLink = createEmbed(`${user.N} Message Hub`, `http://neochicago.network/er/${message.author.id}`);
        message.author.send('Here you are Edgerunner', embedLink)
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
        let convo = await db.Conversation.findOne({ '$and': [{ M: { '$in': [dbSend._id] } }, { M: { '$in': [dbRec._id] } }] });
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

        disReceiver.send(`You have a new message on Kairos from ${dbSend.N}\nhttp://neochicago.network/er/${recId}/ch/${dbSend._id}`);

        return `Message has been sent to ${disReceiver.username}`;
    },
    eightBall: (message) => {
        message.reply(`Consulting the magic...\n- ${eightBall[Math.floor(Math.random() * 20)]}`);
        return;
    }
};