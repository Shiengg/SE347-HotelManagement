require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to database:', uri);
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'hotel_management'
        });
        
        console.log('Success!!!');
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;