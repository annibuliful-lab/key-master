import {
  getUserPermissions,
  validateAuthentication,
} from '@key-master/graphql';
import { ForbiddenError, AuthenticationError } from 'apollo-server-fastify';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';
import { IGatewayContext } from './validate-ws-auth';

export const validateHttpAuth = async ({
  request,
}: {
  request: FastifyRequest;
}): Promise<IGatewayContext> => {
  const authorization = request.headers['authorization'];
  const allowTestSecret = request.headers['x-allow-test'] as string;
  const projectId = request.headers['x-project-id'] as string;
  const userId = request.headers['x-user-id'] as string;
  const permissions = (request.headers['x-user-permissions'] ?? '') as string;
  const orgId = (request.headers['x-org-id'] as string) ?? null;

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
          )?.permissions || [],
      'x-user-role': 'KeyAdmin',
      authorization,
    };
  }

  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return null;
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
