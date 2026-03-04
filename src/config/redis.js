import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

const connectRedis = async () => {
    await redisClient.connect();
    console.log('✅ Redis Connected');
};

export { redisClient, connectRedis };