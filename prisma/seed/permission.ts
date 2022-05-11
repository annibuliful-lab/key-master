import { Permission } from '@prisma/client';
import { prismaClient } from '../client';

export const permissions: Pick<Permission, 'id' | 'permission'>[] = [
  {
    id: 'afc553ac-654e-4796-b106-1c8c815c0e7a',
    permission: 'USER_WRITE',
  },
  {
    id: '4ad29fb3-1291-4d3d-a17a-24cc60af7142',
    permission: 'USER_READ',
  },
  {
    id: 'cca0ec98-c572-4bdd-b353-08e60f8937cb',
    permission: 'PROJECT_READ',
  },
  {
    id: '98a1749e-171f-4cf7-a060-b4d4912da96e',
    permission: 'PROJECT_WRITE',
  },
  {
    id: '4159ac61-9ed6-4a47-a4fd-9cbdae938b11',
    permission: 'ROLE_READ',
  },
  {
    id: '37906c51-4509-4419-b71c-40fd083659b9',
    permission: 'ROLE_WRITE',
  },
  {
    id: 'e161c02b-a2cd-4460-8005-3389f716475b',
    permission: 'PROJECT_ROLE_READ',
  },
  {
    id: 'c224b62c-0d52-4c21-8c17-bf6ead487328',
    permission: 'PROJECT_ROLE_WRITE',
  },
  {
    id: 'ed409ce5-11a4-44e0-990a-7dd9cf9154e9',
    permission: 'PROJECT_USER_READ',
  },
  {
    id: '65ca3188-e54a-4b31-9dd8-ba388f9d4e5a',
    permission: 'PROJECT_USER_WRITE',
  },
  {
    id: '1e113c99-79df-4cec-ba87-6e9b2f6aa1aa',
    permission: 'PERMISSION_WRITE',
  },
  {
    id: 'ff7ac44e-2887-4002-8698-65cbf8fb139e',
    permission: 'PERMISSION_READ',
  },
  {
    id: '7131df8e-3e19-45fa-ad14-9739164bf993',
    permission: 'PROJECT_DELETE',
  },
  {
    id: 'ddb28368-857c-4eae-93f2-175863aa9c89',
    permission: 'PROJECT_ROLE_USER_WRITE',
  },
  {
    id: 'd744c386-2bd8-427a-8e96-9edbf3a53aa1',
    permission: 'PROJECT_ROLE_USER_READ',
  },
  {
    id: 'edab10aa-24ff-4e7a-90aa-cc595e584335',
    permission: 'PROJECT_ORGANIZATION_USER_READ',
  },
  {
    id: 'b683f546-df05-4ca7-a618-d960ef3789cb',
    permission: 'PROJECT_ORGANIZATION_USER_WRITE',
  },
  {
    id: '351386cf-63ff-403c-bc8b-2cb53f94c553',
    permission: 'PROJECT_ORGANIZATION_WRITE',
  },
  {
    id: '2df5d799-d713-45b3-9fec-f090ffd83d51',
    permission: 'PROJECT_ORGANIZATION_READ',
  },
];

export const createPermissions = async () => {
  const listCreatePermissions = permissions.map((data) =>
    prismaClient.permission.upsert({
      where: {
        id: data.id,
      },
      update: {},
      create: data,
    })
  );
  const result = await prismaClient.$transaction(listCreatePermissions);
  console.log('Created permissions', { permissions: result });
};
