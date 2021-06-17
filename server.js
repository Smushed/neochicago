require("dotenv").config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const mongoose = require(`mongoose`);

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/assets')));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

MONGODB_URI = process.env.MONGO_ATLUS;

try {
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
} catch (err) {
    console.log(err);
}

require('./routes/htmlRoutes')(app);

app.listen(PORT, function () {
    console.log('Listening on port %s', PORT);
});

//DISCORD
const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) } });

require('./discord/dLogin')(client);
require('./discord/dMessages')(client)

client.login(process.env.DISCORD_TOKEN);