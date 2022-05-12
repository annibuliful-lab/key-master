import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { executeRemoteSchema } from '@key-master/graphql';

const { stitchingDirectivesTransformer } = stitchingDirectives();

export const makeGatewaySchema = async () => {
  const userSchema = await executeRemoteSchema({
    host: 'localhost',
    port: 3000,
    supportWs: true,
  });

  const authSchema = await executeRemoteSchema({
    host: 'localhost',
    port: 3001,
    supportWs: true,
  });

  const projectSchema = await executeRemoteSchema({
    host: 'localhost',
    port: 3002,
  });

  const keyManagementSchema = await executeRemoteSchema({
    host: 'localhost',
    port: 3003,
  });

  const userActivitySchema = await executeRemoteSchema({
    host: 'localhost',
    port: 3004,
    supportWs: true,
  });

  return stitchSchemas({
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
    subschemas: [
      {
        schema: userSchema,
      },
      {
        schema: authSchema,
      },
      {
        schema: projectSchema,
      },
      {
        schema: keyManagementSchema,
      },
      {
        schema: userActivitySchema,
      },
    ],
  });
};
