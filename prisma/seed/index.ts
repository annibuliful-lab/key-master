import { createPermissions } from './permission';
import { createProject } from './project';
import { createUser } from './user';

const main = async () => {
  await createPermissions();
  await createUser();
  await createProject();
};

main();
