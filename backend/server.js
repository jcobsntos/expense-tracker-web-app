require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const KeepAliveService = require("./keepAlive");

const app = express();

console.log('🚀 Starting Expense Tracker Backend...');
console.log('🔍 Environment Variables Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- CLIENT_URL:', process.env.CLIENT_URL || 'not set');
console.log('- CORS_ORIGIN:', process.env.CORS_ORIGIN || 'not set');
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'set' : 'NOT SET');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'NOT SET');
console.log('- RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL || 'not set');

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

console.log('🔗 Connecting to MongoDB...');
// Connect to DB
connectDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/budget", budgetRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Enhanced Health Check Route
app.get("/ping", async (req, res) => {
    try {
        // Check database connection
        const mongoose = require('mongoose');
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        res.status(200).json({
            status: "OK",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: dbStatus,
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Additional health check for UptimeRobot
app.get("/health", (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;

// Initialize keep-alive service for production
let keepAlive;
if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    keepAlive = new KeepAliveService(`${process.env.RENDER_EXTERNAL_URL}/health`);
    
    // Add keep-alive status endpoint
    app.get('/keep-alive/status', (req, res) => {
        res.json(keepAlive ? keepAlive.getStatus() : { isRunning: false, message: 'Keep-alive service not initialized' });
    });
}

const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/ping`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Start keep-alive service after server is ready
    if (keepAlive) {
        setTimeout(() => {
            keepAlive.start();
            console.log(`🔄 Keep-alive service started for ${process.env.RENDER_EXTERNAL_URL}`);
        }, 5000); // Wait 5 seconds before starting keep-alive
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🔄 SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Promise Rejection:', error);
    process.exit(1);
});
