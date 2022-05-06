import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL);
