import { Client } from '../generated';
import { createProjectOrganization } from './project-organization';
import { createProjectRoleUser } from './project-role-user';

interface ICreateOrganizationUserParam {
  client: Client;
  customRoleId?: string;
  customFullname?: string;
  customOrganizationId?: string;
}
export async function createOrganizationUser({
  client,
  customOrganizationId,
  ...args
}: ICreateOrganizationUserParam) {
  const organization = await createProjectOrganization({ client });
  const projectRoleUser = await createProjectRoleUser({ client, ...args });

  return client.chain.mutation
    .createOrganizationUser({
      input: {
        organizationId: customOrganizationId
          ? customOrganizationId
          : organization.id,
        userId: projectRoleUser.userId,
      },
    })
    .get({
      organizationId: true,
      id: true,
      userId: true,
    });
}
