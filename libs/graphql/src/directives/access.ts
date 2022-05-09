import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { ForbiddenError } from 'apollo-server-core';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { IAppContext } from '../graphql-context';

export function accessDirective() {
  const directiveName = 'access';

  return {
    accessdDirectiveTypeDefs: `directive @${directiveName}(permission: String!) on FIELD_DEFINITION`,
    aceessDirectiveValidator: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const accessDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];
          if (accessDirective) {
            const permission = accessDirective['permission'];
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = async function (
              source,
              args,
              context: IAppContext,
              info
            ) {
              if (!context.permissions.includes(permission)) {
                throw new ForbiddenError(
                  `You must have permission: ${permission}`
                );
              }

              return resolve(source, args, context, info);
            };

            return fieldConfig;
          }
        },
      }),
  };
}
