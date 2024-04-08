const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Admin-panel').then(() => {
    console.log("Database connect Successfully...");
}).catch((err) => {
    console.log(err,"Database Errer");
})

module.exports = mongoose; 