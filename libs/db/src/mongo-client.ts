import { PrismaClient } from '@prisma/client-mongo';

import { config } from 'dotenv';

config();

const shouldLog = process.env.LOG_PRISMA_CLIENT === 'true';

export const mongoClient = new PrismaClient(
  shouldLog
    ? {
        log: [
          {
            emit: 'event',
            level: 'query',
          },
          {
            emit: 'stdout',
            level: 'error',
          },
          {
            emit: 'stdout',
            level: 'info',
          },
          {
            emit: 'stdout',
            level: 'warn',
          },
        ],
      }
    : undefined
);

if (shouldLog) {
  mongoClient.$on('query', (e) => {
    console.log('\n');
    console.log(`Target: ${e.target}`);
    console.log(`Query: ${e.query}`);
    console.log(`Param: ${e.params}`);
    console.log(`Duration: ${e.duration} ms`);
    console.log('\n');
  });
}
