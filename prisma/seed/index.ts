import { createProjectOrganization } from './organization/organization';
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

  // organization
  await createProjectOrganization();
  await createOrganizationUser();
};

main();
