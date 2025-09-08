#!/usr/bin/env node

/**
 * External Keep-Alive Script
 * 
 * This script can be used with cron-job.org or similar services
 * to keep your Render app awake.
 * 
 * Usage with cron-job.org:
 * 1. Set up a cron job to run every 14 minutes
 * 2. Use this URL: https://your-app-name.onrender.com/health
 * 3. Or run this script on a VPS/server with cron
 */

const https = require('https');
const http = require('http');

const SERVER_URL = process.env.SERVER_URL || 'https://your-app-name.onrender.com';
const ENDPOINT = '/health';
const TIMEOUT = 30000; // 30 seconds

function ping() {
    const url = `${SERVER_URL}${ENDPOINT}`;
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    console.log(`🏃 Pinging ${url} at ${new Date().toISOString()}`);
    
    const req = client.get(url, {
        timeout: TIMEOUT
    }, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log(`✅ Success! Status: ${res.statusCode}, Response: ${data}`);
            } else {
                console.log(`⚠️ Warning! Status: ${res.statusCode}, Response: ${data}`);
            }
        });
    });
    
    req.on('timeout', () => {
        console.log('❌ Request timed out');
        req.destroy();
    });
    
    req.on('error', (error) => {
        console.log(`❌ Error: ${error.message}`);
    });
    
    req.end();
}

// If running directly
if (require.main === module) {
    ping();
}

module.exports = { ping };
