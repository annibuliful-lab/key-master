import { prismaClient } from '@key-master/db';
import type { IJwtAuthInfo } from '../@types/auth';
import { verify } from './jwt';
interface IValidateAuthenticationParam {
  token: string;
  projectId?: string;
}
export const validateAuthentication = async ({
  token,
  projectId,
}: IValidateAuthenticationParam) => {
  const { isValid, userInfo } = verify<IJwtAuthInfo>(token);

  if (!isValid) {
    return null;
  }

  let permissions = [];
  let role: string | null = null;
  const user = await getUserInfo(userInfo.userId);

  if (projectId) {
    const userPermissions = await getUserPermissions({
      projectId,
      userId: user.id,
    });

    permissions = userPermissions.role.rolePermissions.map(
      (role) => role.permission
    );
    role = userPermissions.role.role;
  }

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    permissions,
    role,
  };
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
              permission: true,
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
