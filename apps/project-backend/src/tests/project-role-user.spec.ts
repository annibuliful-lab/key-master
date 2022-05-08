import {
  Client,
  createProjectRoleUser,
  createUser,
  projectOwnerAClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

const ROLE_ID = 'ROLE_USER_ID';
const ROLE_ADMIN_ID = 'ROLE_ADMIN_ID';

describe('Project Role User', () => {
  let client: Client = null;

  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Mutation', () => {
    it('creates correctly', async () => {
      const user = await createUser({});
      const projectRoleUser = await client.chain.mutation
        .createProjectRoleUser({
          input: {
            userId: user.id,
            roleId: ROLE_ID,
          },
        })
        .get({
          roleId: true,
          userId: true,
        });

      expect(projectRoleUser.roleId).toEqual(ROLE_ID),
        expect(projectRoleUser.userId).toEqual(user.id);
    });

    it('throws error when role id not found', async () => {
      const user = await createUser({});

      expect(
        client.chain.mutation
          .createProjectRoleUser({
            input: {
              userId: user.id,
              roleId: `MOCK_WRONG_ROLE_ID_${nanoid()}`,
            },
          })
          .get({
            roleId: true,
            userId: true,
          })
      ).rejects.toBeTruthy();
    });

    it('throws error when user id not found', () => {
      expect(
        client.chain.mutation
          .createProjectRoleUser({
            input: {
              userId: `MOCK_USER_ID_${nanoid()}`,
              roleId: ROLE_ID,
            },
          })
          .get({
            roleId: true,
            userId: true,
          })
      ).rejects.toBeTruthy();
    });
  });
  it('updates an existing completely', async () => {
    const projectRoleUser = await createProjectRoleUser({ client });
    const updated = await client.chain.mutation
      .updateProjectRoleUser({
        id: projectRoleUser.id,
        input: {
          active: false,
          roleId: ROLE_ADMIN_ID,
        },
      })
      .get({
        id: true,
        active: true,
        roleId: true,
      });

    expect(updated.id).toEqual(projectRoleUser.id);
    expect(updated.roleId).toEqual(ROLE_ADMIN_ID);
    expect(updated.active).toBeFalsy();
  });

  it('it throws error with wrong id', () => {
    expect(
      client.chain.mutation
        .updateProjectRoleUser({
          id: `MOCK_WRONG_PROJECT_ROLE_USER_ID_${nanoid()}`,
          input: {
            active: false,
            roleId: ROLE_ADMIN_ID,
          },
        })
        .get({
          id: true,
          active: true,
          roleId: true,
        })
    ).rejects.toBeTruthy();
  });

  it('deletes with correct id', async () => {
    const projectRoleUser = await createProjectRoleUser({ client });
    const getBeforeDelete = await client.chain.query
      .getProjectRoleUserById({
        id: projectRoleUser.id,
      })
      .id.get();

    expect(getBeforeDelete).toEqual(projectRoleUser.id);

    expect(
      await client.chain.mutation
        .deleteProjectRoleUser({
          id: projectRoleUser.id,
        })
        .success.get()
    ).toBeTruthy();

    expect(
      client.chain.query
        .getProjectRoleUserById({
          id: projectRoleUser.id,
        })
        .id.get()
    ).rejects.toBeTruthy();
  });

  it('throws error when delete with wrong id', () => {
    expect(
      client.chain.mutation
        .deleteProjectRoleUser({
          id: `MOCK_WRONG_PROJECT_ROLE_${nanoid()}`,
        })
        .success.get()
    ).rejects.toBeTruthy();
  });

  describe('Query', () => {
    it('gets with correct id', async () => {
      const projectRoleUser = await createProjectRoleUser({ client });
      const result = await client.chain.query
        .getProjectRoleUserById({
          id: projectRoleUser.id,
        })
        .id.get();
      expect(result).toEqual(projectRoleUser.id);
    });

    it('throws error when get with wrong id', async () => {
      expect(
        client.chain.query
          .getProjectRoleUserById({
            id: `MOCK_WRONG_PROJECT_ROLE_USER_${nanoid()}`,
          })
          .id.get()
      ).rejects.toBeTruthy();
    });

    it('throws error when get deleted id', async () => {
      const projectRoleUser = await createProjectRoleUser({ client });
      await client.chain.mutation
        .deleteProjectRoleUser({
          id: projectRoleUser.id,
        })
        .success.get();

      expect(
        client.chain.query
          .getProjectRoleUserById({
            id: projectRoleUser.id,
          })
          .id.get()
      ).rejects.toBeTruthy();
    });
  });
});
