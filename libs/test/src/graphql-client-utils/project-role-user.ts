import { Client } from '../generated';
import { createUser } from './user';
interface ICreateProjectRoleUserParam {
  client: Client;
  customRoleId?: string;
}
export async function createProjectRoleUser({
  client,
  customRoleId,
}: ICreateProjectRoleUserParam) {
  const user = await createUser({});
  const roleId = customRoleId ? customRoleId : 'ROLE_USER_ID';

  return client.chain.mutation
    .createProjectRoleUser({
      input: {
        userId: user.id,
        roleId,
      },
    })
    .get({
      id: true,
      roleId: true,
      userId: true,
    });
}
