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
    if (userPermissions.permissions.length === 0) {
      return 'FORBIDDEN';
    }

    permissions = userPermissions.permissions;

    role = userPermissions.role;

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
const getUserPermissions = async ({
  projectId,
  userId,
}: IGetUserPermissionsParam): Promise<{
  userId: string;
  permissions: string[];
  role: string;
} | null> => {
  const cacheUserPermissions = await redisClient.get(`${userId}-${projectId}`);

  if (cacheUserPermissions) {
    return JSON.parse(cacheUserPermissions);
  }

  const userPermissions = await prismaClient.projectRoleUser.findFirst({
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
      project: {
        deletedAt: null,
      },
      role: {
        deletedAt: null,
        rolePermissions: {
          some: {
            permission: {
              deletedAt: null,
            },
            deletedAt: null,
          },
        },
      },
      userId: userId,
    },
  });

  if (!userPermissions) {
    return null;
  }

  return {
    userId,
    role: userPermissions.role.role,
    permissions: userPermissions.role.rolePermissions.map(
      (rolePermission) => rolePermission.permission.permission
    ),
  };
};

export const getAllPermissions = async () => {
  return (
    await prismaClient.permission.findMany({
      select: {
        permission: true,
      },
      where: {
        deletedAt: null,
      },
    })
  ).map((p) => p.permission);
};
