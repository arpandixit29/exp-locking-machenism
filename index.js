import app from './src/app.js';
import { connectRedis } from './src/config/redis.js';

const PORT = 3000;

const startServer = async () => {
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();