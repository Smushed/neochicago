require("dotenv").config();
const db = require('../../models');

module.exports = {
    findGuild: async (client) => {
        console.log(`hit`)
        const guild = await client.guilds.fetch(process.env.GUILD_ID);

        const members = await guild.members.fetch();
        members.forEach(member => console.log(member.user.username, member.user.id));
    },
    saveUsers: () => {
        //This is to just init the new database. Don't use this unless the data is lost for some reason
        const users = ['98923028083138560', '106626827644059648', '132149821728358401', '349349897256042496', '528616089257771019'];
        const userName = ['OwlSpotter', 'NeverFree', 'Smushed', 'Ecrunch', 'Cjl6400'];

        for (let i = 0; i < users.length; i++) {
            const newUser = {
                N: userName[i],
                P: true,
                DID: users[i], //DiscordId
                DUN: userName[i], //Discord String
            }
            db.User.create(newUser);
        }
    }
}
