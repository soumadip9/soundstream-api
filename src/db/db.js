const mongoose = require('mongoose');


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB');
    }
        catch (error) {
            console.error(process.env.MONGO_URI);
        }
    }

    module.exports = connectDB;
