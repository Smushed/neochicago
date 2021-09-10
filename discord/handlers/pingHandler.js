const Discord = require('discord.js');
const db = require('../../models');
const axios = require('axios');

const helpMessage = 'Kairos Response -\n*People who need help shouldn\'t be on the net.* \n\n.link - Link to Kairos Website\n.id - get ID for Kairos \n.messages - Your Messages\n.8 - Consult Magic\n.recent - Get most recent message';
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

const getMostRecentMessage = async (id) => {
    return await db.Message.findOne({ R: id }).sort('-D').exec();
};

const getUserIdByDiscord = async (discordId) => {
    return await db.User.findOne({ DID: discordId }, '_id N').exec();
};

const getConversation = async (id1, id2) => {
    return await db.Conversation.findOne({ '$and': [{ M: { '$in': [id1] } }, { M: { '$in': [id2] } }] }).exec();

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
    writeMessageToPCFromCMD: async (client, sender, receiver, message) => {
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

        let convo = await getConversation(dbSend._id, dbRec._id);
        if (!convo) {
            convo = await db.Conversation.create({
                M: [dbRec._id, dbSend._id]
            });
        };

        const time = new Date();
        await db.Message.create({
            S: dbSend._id,
            R: dbRec._id,
            M: message,
            D: time,
            C: convo._id
        })

        disReceiver.send(`You have a new message on Kairos from ${dbSend.N}\nhttp://neochicago.network/er/${recId}/ch/${dbSend._id}`);

        return `Message has been sent to ${disReceiver.username}`;
    },
    eightBall: (message) => {
        message.reply(`Consulting the magic...\n- ${eightBall[Math.floor(Math.random() * 20)]}`);
        return;
    },
    getRecent: async (message) => {
        const user = await getUserIdByDiscord(message.author.id);
        const recentMessage = await getMostRecentMessage(user._id);
        const sender = await db.User.findById(recentMessage.S, 'N').exec();
        message.author.send(`Last Received Message -\nFrom ${sender.N}\n - ${recentMessage.M}`);
        return;
    },
    replyToLast: async (message, client) => {
        const user = await getUserIdByDiscord(message.author.id);
        const recentMessage = await getMostRecentMessage(user._id);
        const npc = await db.User.findById(recentMessage.S).exec();
        const convo = await getConversation(user._id, npc._id);

        const messageArray = message.content.trim().split(' ');
        messageArray.shift();
        if (messageArray.length < 1) {
            message.reply('Don\'t mess around. Write something or don\'t respond.');
            return;
        }
        const reply = messageArray.join(' ');

        const time = new Date();
        await db.Message.create({
            S: user._id,
            R: npc._id,
            M: reply,
            D: time,
            C: convo._id
        });

        message.reply(`Message sent to ${npc.N}`);
        let admin = await client.users.fetch(process.env.KEVIN);
        admin.send(`User ${user.N} sent ${npc.N} a new message\n - ${reply}\n\nhttp://neochicago.network/carmack/${message.author.id}/${npc._id}`);

        return;
    }
};