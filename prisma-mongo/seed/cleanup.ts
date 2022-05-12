import { mongoClient } from '../client';

export async function cleanupCollection() {
  await mongoClient.userActivity.deleteMany({});
  await mongoClient.auditLog.deleteMany({});
}
