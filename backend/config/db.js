const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }
        
        console.log('🔗 Attempting to connect to MongoDB...');
        
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Increased timeout
            socketTimeoutMS: 45000,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0 // Disable mongoose buffering
        });
        
        console.log('✅ MongoDB connected successfully');
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('🔗 Mongoose connected to MongoDB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('🔌 Mongoose disconnected from MongoDB');
        });
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.error('Full error:', error);
        
        // In production, don't exit immediately, let Render restart the service
        if (process.env.NODE_ENV === 'production') {
            console.log('⚠️ Production mode: Will retry connection in 10 seconds...');
            setTimeout(() => {
                process.exit(1);
            }, 10000);
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;