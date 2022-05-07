import { nanoid } from 'nanoid';
import { Client } from '../generated';
interface ICreateProjectRoleParam {
  client: Client;
  customRole?: string;
}
export function createProjectRole({
  customRole,
  client,
}: ICreateProjectRoleParam) {
  const role = customRole ? customRole : `MOCK_ROLE_${nanoid()}`;

  return client.chain.mutation
    .createProjectRole({
      input: {
        role,
      },
    })
    .get({ id: true, role: true });
}
