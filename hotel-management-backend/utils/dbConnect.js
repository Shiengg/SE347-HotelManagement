require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        console.log('Connecting to database:', process.env.MONGODB_URI);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'hotel-management'
        });

        console.log(`Success!!!`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Current database: ${conn.connection.db.databaseName}`);
        
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;