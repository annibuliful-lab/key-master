import {
  Client,
  createProjectOrganization,
  projectOwnerGraphqlClient,
  projectOwnerAClient,
  createProject,
  deleteProject,
  deleteProjectOrganization,
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

    it('update an existing organization', async () => {
      const organization = await createProjectOrganization({ client });
      const newName = `MOCK_NEW_ORGANIZATION_NAME_${nanoid()}`;

      const updatedOrganization = await client.chain.mutation
        .updateProjectOrganization({
          id: organization.id,
          input: {
            name: newName,
            active: false,
          },
        })
        .get({ id: true, name: true, active: true });
      expect(updatedOrganization.active).toBeFalsy();
      expect(updatedOrganization.id).toEqual(organization.id);
      expect(updatedOrganization.name).toEqual(newName);
    });

    it('throws error when update wrong organization', async () => {
      expect(
        client.chain.mutation
          .updateProjectOrganization({
            id: `WRONG_ORGANIZATION_ID_${nanoid()}`,
            input: {
              active: false,
            },
          })
          .get({ id: true, name: true, active: true })
      ).rejects.toBeTruthy();
    });
    it('throws error when update with duplicated organization name', async () => {
      const [organizationA, organizationB] = await Promise.all([
        createProjectOrganization({ client }),
        createProjectOrganization({ client }),
      ]);

      expect(
        client.chain.mutation
          .updateProjectOrganization({
            id: organizationB.id,
            input: {
              name: organizationA.name,
              active: false,
            },
          })
          .get({ id: true, name: true, active: true })
      ).rejects.toBeTruthy();
    });

    it('throws error when update deleted organization', async () => {
      const organization = await createProjectOrganization({ client });
      await deleteProjectOrganization({ client, id: organization.id });
      expect(
        client.chain.mutation
          .updateProjectOrganization({
            id: organization.id,
            input: {
              active: false,
            },
          })
          .get({ id: true, name: true, active: true })
      ).rejects.toBeTruthy();
    });

    it('deletes an existing organization', async () => {
      const organization = await createProjectOrganization({ client });
      expect(
        client.chain.mutation
          .deleteProjectOrganization({ id: organization.id })
          .success.get()
      ).toBeTruthy();
    });
  });

  describe('Query', () => {
    it('gets organization', async () => {
      const created = await createProjectOrganization({ client });
      const organization = await client.chain.query
        .getProjectOrganizationById({ id: created.id })
        .get({
          id: true,
          name: true,
        });

      expect(organization.id).toEqual(created.id);
      expect(organization.name).toEqual(created.name);
    });

    it('throws error when get by wrong id', () => {
      expect(
        client.chain.query
          .getProjectOrganizationById({
            id: `WRONG_ORGANIZATION_ID_${nanoid()}`,
          })
          .get({
            id: true,
            name: true,
          })
      ).rejects.toBeTruthy();
    });

    it('throws error when get by deleted organization', async () => {
      const created = await createProjectOrganization({ client });
      await deleteProjectOrganization({ client, id: created.id });
      expect(
        client.chain.query
          .getProjectOrganizationById({
            id: created.id,
          })
          .get({
            id: true,
            name: true,
          })
      ).rejects.toBeTruthy();
    });

    it('returns organizations', async () => {
      await Promise.all([
        createProjectOrganization({ client }),
        createProjectOrganization({ client }),
      ]);
      const organizations = await client.chain.query
        .getProjectOrganizations({})
        .get({ id: true, name: true, active: true });

      expect(organizations.length).toBeGreaterThanOrEqual(2);
    });

    it('returns organizations with limit', async () => {
      await Promise.all([
        createProjectOrganization({ client }),
        createProjectOrganization({ client }),
      ]);
      const organizations = await client.chain.query
        .getProjectOrganizations({ filter: { take: 1 } })
        .get({ id: true, name: true, active: true });
      expect(organizations).toHaveLength(1);
    });

    it('returns organizations with contain search text', async () => {
      await Promise.all([
        createProjectOrganization({
          client,
          customOrganization: `SEARCH_TEXT_ORGANIZATION_${nanoid()}`,
        }),
        createProjectOrganization({
          client,
          customOrganization: `SEARCH_TEXT_ORGANIZATION_${nanoid()}`,
        }),
      ]);

      const organizations = await client.chain.query
        .getProjectOrganizations({
          filter: { search: 'search_text_organization' },
        })
        .get({ id: true, name: true });
      expect(
        organizations.every((permision) =>
          permision.name.includes('SEARCH_TEXT_ORGANIZATION')
        )
      ).toBeTruthy();
    });

    it('returns organizations with contain search text with limit', async () => {
      await Promise.all([
        createProjectOrganization({
          client,
          customOrganization: `SEARCH_TEXT_ORGANIZATION_LIMIT_${nanoid()}`,
        }),
        createProjectOrganization({
          client,
          customOrganization: `SEARCH_TEXT_ORGANIZATION_LIMIT_${nanoid()}`,
        }),
      ]);

      const organizations = await client.chain.query
        .getProjectOrganizations({
          filter: { search: 'search_text_organization_limit', take: 1 },
        })
        .get({ id: true, name: true });
      expect(organizations).toHaveLength(1);
      expect(
        organizations.every((permision) =>
          permision.name.includes('SEARCH_TEXT_ORGANIZATION')
        )
      ).toBeTruthy();
    });

    it('returns organizations with cursor', async () => {
      const [cursor] = await Promise.all([
        createProjectOrganization({ client }),
        createProjectOrganization({ client }),
      ]);
      const organizations = await client.chain.query
        .getProjectOrganizations({
          filter: { cursor: cursor.id },
        })
        .get({ id: true, name: true });

      expect(organizations.every((p) => p.id !== cursor.id)).toBeTruthy();
    });

    it('returns an organization with project field', async () => {
      const created = await createProjectOrganization({ client });
      const organization = await client.chain.query
        .getProjectOrganizationById({
          id: created.id,
        })
        .get({
          project: {
            id: true,
            name: true,
          },
        });
      expect(organization.project.id).toEqual('TEST_PROJECT_ID');
      expect(organization.project.name).toEqual('test-project');
    });
  });
});
