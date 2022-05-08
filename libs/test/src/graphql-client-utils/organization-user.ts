import { Client } from '../generated';
import { createProjectOrganization } from './project-organization';
import { createProjectRoleUser } from './project-role-user';

interface ICreateOrganizationUserParam {
  client: Client;
  customRoleId?: string;
  customFullname?: string;
}
export async function createOrganizationUser({
  client,
  ...args
}: ICreateOrganizationUserParam) {
  const organization = await createProjectOrganization({ client });
  const projectRoleUser = await createProjectRoleUser({ client, ...args });

  return client.chain.mutation
    .createOrganizationUser({
      input: {
        organizationId: organization.id,
        userId: projectRoleUser.userId,
      },
    })
    .get({
      organizationId: true,
      userId: true,
    });
}
