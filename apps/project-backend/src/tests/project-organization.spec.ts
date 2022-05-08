import {
  Client,
  createProjectOrganization,
  projectOwnerGraphqlClient,
  projectOwnerAClient,
  createProject,
  deleteProject,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Project Organization', () => {
  let client: Client = null;

  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Mutation', () => {
    it('creates new organization', async () => {
      const organizationName = `MOCK_ORGANIZATION_${nanoid()}`;
      const organization = await client.chain.mutation
        .createProjectOrganization({
          input: {
            name: organizationName,
          },
        })
        .get({ id: true, name: true, active: true });
      expect(organization.active).toBeTruthy();
      expect(organization.name).toEqual(organizationName);
      expect(organization.id).toBeDefined();
    });

    it('throws error when create duplicate organization', async () => {
      const organizationName = `MOCK_ORGANIZATION_${nanoid()}`;
      await createProjectOrganization({
        client,
        customOrganization: organizationName,
      });
      expect(
        client.chain.mutation
          .createProjectOrganization({
            input: {
              name: organizationName,
            },
          })
          .get({ id: true, name: true, active: true })
      ).rejects.toBeTruthy();
    });

    it('throws error when create organization with create', async () => {
      const project = await createProject({ client });
      const projectClient = projectOwnerGraphqlClient({
        projectId: project.id,
        userId: 'TEST_USER_A_ID',
      });

      await deleteProject({ client, id: project.id });

      expect(
        projectClient.chain.mutation
          .createProjectOrganization({
            input: {
              name: 'MOCK_NAME',
            },
          })
          .get({ id: true, name: true, active: true })
      ).rejects.toBeTruthy();
    });
  });
});
