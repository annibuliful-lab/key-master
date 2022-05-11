import {
  getUserPermissions,
  validateAuthentication,
} from '@key-master/graphql';
import { AuthenticationError, ForbiddenError } from 'apollo-server-fastify';
import { isEmpty } from 'lodash';

export interface IGatewayContext {
  'x-user-id': string;
  'x-project-id': string;
  'x-user-permissions': string[];
  'x-user-role': string;
  authorization: string;
}

export const validateWsAuthentication = async (headers: IGatewayContext) => {
  const authorization = headers['authorization'];
  const allowTestSecret = headers['x-allow-test'] as string;
  const projectId = headers['x-project-id'] as string;
  const userId = headers['x-user-id'] as string;
  const permissions = (headers['x-user-permissions'] ?? '') as string;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    throw new AuthenticationError('Unauthorization');
  }

  if (
    authorization?.startsWith('TEST-AUTH') &&
    allowTestSecret === process.env.SKIP_AUTH_SECRET
  ) {
    return {
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
    'x-user-id': userAuth.userId,
    'x-project-id': projectId,
    'x-user-permissions': userAuth.permissions,
    'x-user-role': userAuth.role,
    authorization,
  };
};
