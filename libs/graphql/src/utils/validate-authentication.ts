import { prismaClient, redisClient } from '@key-master/db';
import type { IJwtAuthInfo } from '../@types/auth';
import { verify } from './jwt';

const CACHE_EXPIRE = 3600;
interface IValidateAuthenticationParam {
  token: string;
  projectId?: string | null;
  cacheExpire?: number;
}
export const validateAuthentication = async ({
  token,
  projectId = null,
  cacheExpire = CACHE_EXPIRE,
}: IValidateAuthenticationParam): Promise<
  | { userId: string; permissions: string[]; role: string | null }
  | string
  | 'FORBIDDEN'
  | null
> => {
  const { isValid, userInfo } = verify<IJwtAuthInfo>(token);

  if (!isValid) {
    return null;
  }

  // get cache user
  if (userInfo.userId && !projectId) {
    const key = `${userInfo.userId}-null`;
    const authInfo = await redisClient.get(key);
    if (authInfo) {
      return JSON.parse(authInfo);
    }
  }

  // get cache user with projectId from redis
  if (userInfo.userId && projectId) {
    const key = `${userInfo.userId}-${projectId}`;
    const authInfo = await redisClient.get(key);
    if (authInfo) {
      return JSON.parse(authInfo);
    }
  }

  let permissions: string[] = [];
  let role: string | null = null;
  const user = await getUserInfo(userInfo.userId);

  if (projectId) {
    const userPermissions = await getUserPermissions({
      projectId,
      userId: user.id,
    });

    // prevent fobidden permission and role in selected project
    if (!userPermissions) {
      return 'FORBIDDEN';
    }

    // prevent fobidden permission and role in selected project
    if (userPermissions.role.rolePermissions.length === 0) {
      return 'FORBIDDEN';
    }

    permissions = userPermissions.role.rolePermissions.map(
      (role) => role.permission.permission
    );
    role = userPermissions.role.role;

    // remove duplicate user id key
    await redisClient.del(`${user.id}-null`);

    // cache user id with project id
    await redisClient.set(
      `${user.id}-${projectId}`,
      JSON.stringify({
        userId: user.id,
        permissions,
        role,
      }),
      'EX',
      cacheExpire
    );
  }

  if (!user) {
    return null;
  }

  const authInfo = {
    userId: user.id,
    permissions,
    role,
  };

  // set cache for user auth
  await redisClient.set(
    `${user.id}-${projectId}`,
    JSON.stringify(authInfo),
    'EX',
    cacheExpire
  );

  return authInfo;
};

const getUserInfo = (id: string) => {
  return prismaClient.user.findUnique({
    select: {
      id: true,
    },
    where: {
      id,
    },
  });
};

interface IGetUserPermissionsParam {
  projectId: string;
  userId: string;
}
const getUserPermissions = ({
  projectId,
  userId,
}: IGetUserPermissionsParam) => {
  return prismaClient.projectRoleUser.findFirst({
    select: {
      role: {
        select: {
          role: true,
          rolePermissions: {
            select: {
              permission: {
                select: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      projectId,
      userId: userId,
    },
  });
};
