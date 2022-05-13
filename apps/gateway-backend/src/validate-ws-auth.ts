import {
  getUserPermissions,
  validateAuthentication,
} from '@key-master/graphql';
import { AuthenticationError, ForbiddenError } from 'apollo-server-fastify';
import { isEmpty } from 'lodash';

export interface IGatewayContext {
  'x-user-id': string | null;
  'x-project-id': string;
  'x-user-permissions': string[];
  'x-user-role': string;
  'x-org-id': string;
  authorization: string;
}

export const validateWsAuthentication = async (headers: IGatewayContext) => {
  const authorization = headers['authorization'];
  const allowTestSecret = headers['x-allow-test'] as string;
  const projectId = headers['x-project-id'] as string;
  const userId = headers['x-user-id'] as string;
  const permissions = (headers['x-user-permissions'] ?? '') as string;
  const token = authorization?.replace('Bearer ', '');
  const orgId = (headers['x-org-id'] as string) ?? null;

  if (!token) {
    throw new AuthenticationError('Unauthorization');
  }

  if (
    authorization?.startsWith('TEST-AUTH') &&
    allowTestSecret === process.env.SKIP_AUTH_SECRET
  ) {
    return {
      'x-org-id': orgId,
      'x-user-id': userId,
      'x-project-id': projectId,
      'x-user-permissions': !isEmpty(permissions)
        ? permissions.split(',')
        : (
            await getUserPermissions({
              projectId,
              userId,
            })
          ).permissions,
      'x-user-role': 'KeyAdmin',
      authorization,
    };
  }

  const userAuth = await validateAuthentication({ token, projectId });

  if (typeof userAuth === 'string' && userAuth === 'FORBIDDEN') {
    throw new ForbiddenError(`Forbidden with project id ${projectId}`);
  }

  if (!userAuth) {
    throw new AuthenticationError('Unauthorization');
  }

  return {
    'x-org-id': orgId,
    'x-user-id': userAuth.userId,
    'x-project-id': projectId,
    'x-user-permissions': userAuth.permissions,
    'x-user-role': userAuth.role,
    authorization,
  };
};
