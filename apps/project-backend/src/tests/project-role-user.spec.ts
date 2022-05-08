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
});
