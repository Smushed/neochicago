require("dotenv").config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const mongoose = require(`mongoose`);

const app = express();

const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views')

MONGODB_URI = process.env.MONGO_ATLUS;

try {
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
} catch (err) {
    console.log(err);
}

require('./routes/htmlRoutes')(app);

app.use(express.static(path.join(__dirname, '/assets')));

app.listen(PORT, function () {
    console.log('Listening on port %s', PORT);
});