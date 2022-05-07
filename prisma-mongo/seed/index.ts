import { mongoClient } from '../client';
async function main() {
  const audit = await mongoClient.auditLog.create({
    data: {
      projectId: 'TEST_PROJECT_ID',
      serviceName: 'TEST_SERVICE_NAME',
      type: 'CREATE',
      status: 'INFO',
      createdBy: 'TEST_USER',
      updatedBy: 'TEST_USER',
    },
  });
  const createMessage = await mongoClient.message.create({
    data: {
      content: 'TEST_DATA',
      auditId: audit.id,
    },
  });
  console.log('created Message', { createMessage });
}

main();
