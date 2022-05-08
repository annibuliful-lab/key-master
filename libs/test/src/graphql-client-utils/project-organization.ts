import { nanoid } from 'nanoid';
import { Client } from '../generated';
interface ICreateProjectOrganizationParam {
  client: Client;
  customOrganization?: string;
}
export function createProjectOrganization({
  client,
  customOrganization,
}: ICreateProjectOrganizationParam) {
  const organizationName = customOrganization
    ? customOrganization
    : `MOCK_ORGANIZATION_${nanoid()}`;

  return client.chain.mutation
    .createProjectOrganization({
      input: {
        name: organizationName,
      },
    })
    .get({ id: true, name: true, active: true });
}

interface IDeleteProjectOrganizationParam {
  client: Client;
  id: string;
}

export function deleteProjectOrganization({
  id,
  client,
}: IDeleteProjectOrganizationParam) {
  return client.chain.mutation.deleteProjectOrganization({ id }).success.get();
}
