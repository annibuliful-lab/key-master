import { Client, createUser, projectOwnerAClient } from '@key-master/test';
import { nanoid } from 'nanoid';
const ROLE_ID = 'ROLE_USER_ID';

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
});
