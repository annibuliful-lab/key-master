import { createPermissions } from './permission';
import { createProject } from './project';
import { createProjectRoleAndPermissions } from './project-role';
import { createUser } from './user';

const main = async () => {
  await createPermissions();
  await createUser();
  await createProject();
  await createProjectRoleAndPermissions();
};

main();
