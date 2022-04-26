import { createKeyManagement } from './key-management';
import { createProjectOrganization } from './organization/organization';
import { createOrganizationKeyManagement } from './organization/organization-key-management';
import { createOrganizationUser } from './organization/organization-user';
import { createPermissions } from './permission';
import { createProject } from './project/project';
import { createProjectRoleAndPermissions } from './project/project-role';
import { createUser } from './user';

const main = async () => {
  await createPermissions();
  await createUser();
  await createProject();
  await createProjectRoleAndPermissions();
  await createKeyManagement();

  // organization
  await createProjectOrganization();
  await createOrganizationUser();
  await createOrganizationKeyManagement();
};

main();
