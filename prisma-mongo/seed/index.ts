import { mongoClient } from '../client';
async function main() {
  const createMessage = await mongoClient.message.create({
    data: {
      content: 'TEST_DATA',
    },
  });
  console.log('created Message', { createMessage });
}

main();
