import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-core';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { IAppContext } from '../graphql-context';

export function authorizedDirective() {
  const directiveName = 'authorized';

  return {
    authorizedDirectiveTypeDefs: `
    directive @${directiveName} on FIELD_DEFINITION
    `,
    authorizedDirectiveValidator: (schema: GraphQLSchema) =>
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

            return resolve(source, args, context, info);
          };

          return fieldConfig;
        },
      }),
  };
}
