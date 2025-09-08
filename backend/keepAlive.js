const axios = require('axios');

class KeepAliveService {
    constructor(url, interval = 14 * 60 * 1000) { // 14 minutes
        this.url = url;
        this.interval = interval;
        this.intervalId = null;
        this.isRunning = false;
    }

    async ping() {
        try {
            const response = await axios.get(this.url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'KeepAlive-Service/1.0'
                }
            });
            
            console.log(`✅ Keep-alive ping successful: ${response.status} - ${new Date().toISOString()}`);
            return true;
        } catch (error) {
            console.error(`❌ Keep-alive ping failed: ${error.message} - ${new Date().toISOString()}`);
            return false;
        }
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️ Keep-alive service is already running');
            return;
        }

        console.log(`🚀 Starting keep-alive service for ${this.url}`);
        console.log(`⏰ Ping interval: ${this.interval / 60000} minutes`);
        
        this.isRunning = true;
        
        // Initial ping
        this.ping();
        
        // Set up interval
        this.intervalId = setInterval(() => {
            this.ping();
        }, this.interval);
    }

    stop() {
        if (!this.isRunning) {
            console.log('⚠️ Keep-alive service is not running');
            return;
        }

        console.log('🛑 Stopping keep-alive service');
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isRunning = false;
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            url: this.url,
            interval: this.interval,
            intervalMinutes: this.interval / 60000
        };
    }
}

module.exports = KeepAliveService;
