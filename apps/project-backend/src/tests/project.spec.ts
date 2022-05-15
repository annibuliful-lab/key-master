import {
  Client,
  createProject,
  createProjectTag,
  deleteProject,
  expectDuplicatedError,
  expectForbiddenError,
  expectNotFoundError,
  expectPermissionError,
  expectUnauthorizedError,
  projectOwnerAClient,
  projectOwnerGraphqlClient,
  testUserPermissionsClient,
  unAuthorizationClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Project', () => {
  let client: Client = null;
  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Permission', () => {
    it('throws error when create without auth token', () => {
      expectUnauthorizedError(
        createProject({
          customProjectName: 'projectName',
          client: unAuthorizationClient,
        })
      );
    });

    it('throws permission when create without correct auth permission', () => {
      expectPermissionError(
        testUserPermissionsClient(['MOCK_WRONG_PERMISSION'])
          .chain.query.getProjectById({
            id: 'MOCK_ID',
          })
          .id.get()
      );
    });
  });

  describe('Mutation', () => {
    it('creates new project', async () => {
      const projectName = `MOCK_PROJECT_${nanoid()}`;
      const project = await client.chain.mutation
        .createProject({
          input: {
            name: projectName,
          },
        })
        .get({
          id: true,
          name: true,
        });

      const newProjectClient = projectOwnerGraphqlClient({
        projectId: project.id,
        userId: 'TEST_USER_A_ID',
      });

      await Promise.all([
        createProjectTag({ client: newProjectClient, tag: 'AAAA' }),
        createProjectTag({ client: newProjectClient, tag: 'BBBB' }),
      ]);

      const newProjectById = await newProjectClient.chain.query
        .getProjectById({ id: project.id })
        .get({
          tags: {
            id: true,
            tag: true,
          },
        });

      expect(project.id).toBeDefined();
      expect(project.name).toEqual(projectName);

      expect(
        newProjectById.tags.every((tag) => ['AAAA', 'BBBB'].includes(tag.tag))
      ).toBeTruthy();
    });

    it('throws error when create duplicate project', async () => {
      const projectName = `MOCK_PROJECT_${nanoid()}`;
      await createProject({ customProjectName: projectName, client });
      expectDuplicatedError(
        createProject({ client, customProjectName: projectName })
      );
    });

    it('updates an existing project', async () => {
      const projectName = `MOCK_PROJECT_${nanoid()}`;
      const newProjectName = `NEW_PROJECT_${nanoid()}`;

      const projectId = (
        await createProject({ customProjectName: projectName, client })
      ).id;

      const updatedProject = await client.chain.mutation
        .updateProject({
          id: projectId,
          input: {
            name: newProjectName,
          },
        })
        .get({
          id: true,
          name: true,
        });
      expect(updatedProject.id).toEqual(projectId);
      expect(updatedProject.name).toEqual(newProjectName);
    });

    it('throws error when update a deleted project', async () => {
      const project = await createProject({ client });
      await client.chain.mutation
        .deleteProject({
          id: project.id,
        })
        .success.get();

      expectNotFoundError(
        client.chain.mutation
          .updateProject({
            id: project.id,
            input: {
              name: 'TEST',
            },
          })
          .id.get()
      );
    });
    it('deletes an existing project', async () => {
      const project = await createProject({ client });
      expect(
        await client.chain.mutation
          .deleteProject({
            id: project.id,
          })
          .success.get()
      ).toBeTruthy();
    });

    it('throws error with wrong id', async () => {
      expectNotFoundError(
        client.chain.mutation
          .deleteProject({
            id: 'MOCK_WRONG_PROJECT_ID',
          })
          .success.get()
      );
    });
  });

  describe('Query', () => {
    it('gets by id', async () => {
      const project = await createProject({ client });
      const getProject = await client.chain.query
        .getProjectById({ id: project.id })
        .get({
          id: true,
          name: true,
        });

      expect(project).toEqual(getProject);
    });

    it('throws fobidden error when user is not in a project', async () => {
      const project = await createProject({ client });
      const wrongUserClient = projectOwnerGraphqlClient({
        userId: 'TEST_USER_B_ID',
        projectId: 'TEST_PROJECT_ID',
      });

      expectForbiddenError(
        wrongUserClient.chain.query.getProjectById({ id: project.id }).get({
          id: true,
          name: true,
        })
      );
    });

    it('throws not found error when get by wrong id', () => {
      expectNotFoundError(
        client.chain.query.getProjectById({ id: 'MOCK_WRONG_PROJECT_ID' }).get({
          id: true,
          name: true,
        })
      );
    });
    it('throws error when get by deleted id', async () => {
      const newProject = await createProject({ client });
      await deleteProject({ client, id: newProject.id });
      expectNotFoundError(
        client.chain.query.getProjectById({ id: newProject.id }).id.get()
      );
    });
  });
});
