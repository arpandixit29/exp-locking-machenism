import { createClient } from 'redis';

// Use REDIS_URL environment variable when deployed (e.g. Vercel)
// Fallback to default localhost, which works for local development.
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis Connected');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        // if running in serverless environment and Redis is not available,
        // we may want to exit or continue depending on requirements.
        throw err;
    }
};

export { redisClient, connectRedis };