import { createKeyManagement } from './key-management';
import { createProjectOrganization } from './organization/organization';
import { createOrganizationKeyManagement } from './organization/organization-key-management';
import { createOrganizationUser } from './organization/organization-user';
import { createPermissions } from './permission';
import { createProject } from './project/project';
import { createProjectRoleAndPermissions } from './project/project-role';
import { createUser } from './user';
import { prismaClient } from '../client';
import { createProjectRoleUser } from './project/project-role-user';

export async function cleanupDb() {
  const shouldClearTable = true;

  if (shouldClearTable) {
    const tablenames = await prismaClient.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        try {
          const result = await prismaClient.$executeRawUnsafe(
            `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
          );
          console.log(`cleanup table = ${tablename}`, result);
        } catch (error) {
          console.log('clean up error => ', error);
        }
      }
    }
  }
}

const main = async () => {
  await cleanupDb();

  await createPermissions();
  await createUser();
  await createProject();
  await createProjectRoleAndPermissions();
  await createProjectRoleUser();
  await createKeyManagement();

  // organization
  await createProjectOrganization();
  await createOrganizationUser();
  await createOrganizationKeyManagement();
};

main();
