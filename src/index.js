require('dotenv').config();
const app = require('./app');
const mongodbConnect = require('./db/database');

mongodbConnect()

app.listen(3000, () => {
    console.log('server spinning at port 3000');
});
