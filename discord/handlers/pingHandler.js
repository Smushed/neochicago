const helpMessage = 'People who need help shouldn\'t be on the net \n .id - get ID for Kairos \n'

module.exports = {
    pingRyan: async (client) => {
        const ryan = await client.users.fetch(`106626827644059648`);
        const DMawait = await ryan.send('Cyberpunk is coming to life');
        console.log(DMawait)
    },
    help: (message) => {
        message.author.send(`${helpMessage} \n ID: ${message.author.id}`);
    },
    replyId: (message) => {
        message.author.send(message.author.id)
    }
}