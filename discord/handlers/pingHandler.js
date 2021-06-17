const helpMessage = 'People who need help shouldn\'t be on the net \n.link - Link to Kairos\n.id - get ID for Kairos \n.messages - Your Messages'
const Discord = require('discord.js');
const db = require('../../models');

const createEmbed = (title, url, description = '') => {
    return new Discord.MessageEmbed()
        .setTitle(title)
        .setURL(url)
        .setDescription(description);
};

module.exports = {
    pingRyan: async (client) => {
        const ryan = await client.users.fetch('106626827644059648');
        const DMawait = await ryan.send('Cyberpunk is coming to life');
        console.log(DMawait)
    },
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
    }
}