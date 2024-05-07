const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/socialnetworkDB')
.then(() => {
    console.log('MongoDB connected successfully!');
})
.catch(err => {
    console.error(err)
});

module.exports = mongoose.connection;
