import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { IAppContext } from '../graphql-context';

export interface IAccessDirective {
  permission: string;
  requiredProjectId: boolean;
  requiredOrgId: boolean;
  roleName?: string;
}

export function accessDirective() {
  const directiveName = 'access';

  return {
    accessdDirectiveTypeDefs: `
    input AccessDirectiveInput{
      permission: String!
      requiredProjectId: Boolean = false
      requiredOrgId: Boolean = false
      roleName: String
    }

    directive @${directiveName}(conditions: AccessDirectiveInput!) on FIELD_DEFINITION
    `,
    aceessDirectiveValidator: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const accessDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];

          if (!accessDirective) {
            return;
          }

          const accessDirectiveCondition = accessDirective[
            'conditions'
          ] as IAccessDirective;

          const permission = accessDirectiveCondition?.['permission'];

          const roleName = accessDirectiveCondition?.['roleName'];

          const requiredProjectId =
            accessDirectiveCondition?.['requiredProjectId'];

          const requiredOrgId = accessDirectiveCondition?.['requiredOrgId'];

          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (
            source,
            args,
            context: IAppContext,
            info
          ) {
            if (!context.userId) {
              throw new AuthenticationError('Unauthorization');
            }

            if (requiredProjectId && !context.projectId) {
              throw new ForbiddenError('Project id is required');
            }

            if (requiredOrgId && !context.orgId) {
              throw new ForbiddenError('Org id is quired');
            }

            if (roleName && context.role !== roleName) {
              throw new ForbiddenError(`You must have role name: ${roleName}`);
            }

            if (permission && !context.permissions.includes(permission)) {
              throw new ForbiddenError(
                `You must have permission: ${permission}`
              );
            }

            return resolve(source, args, context, info);
          };

          return fieldConfig;
        },
      }),
  };
}
