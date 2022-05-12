import { mongoClient } from '../client';

export async function createAudit() {
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
  console.log('Audit', { audit });
}
