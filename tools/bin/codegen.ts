import {
  buildSchema,
  printSchema,
  parse,
  GraphQLSchema,
  buildASTSchema,
  DocumentNode,
} from 'graphql';
import { codegen } from '@graphql-codegen/core';
import * as fs from 'fs';
import * as path from 'path';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptResolverPlugin from '@graphql-codegen/typescript-resolvers';
import { services } from './services';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { gql } from 'apollo-server-fastify';

const { allStitchingDirectivesTypeDefs } = stitchingDirectives();
const accessdDirectiveTypeDefs = `
input AccessDirectiveInput{
  permission: String
  requiredProjectId: Boolean = false
  requiredOrgId: Boolean = false
  roleName: String
}

directive @access(conditions: AccessDirectiveInput!) on FIELD_DEFINITION
`;

const authorizedDirectiveTypeDefs = `directive @authorized on FIELD_DEFINITION`;

const jsonScalarTypeDefs = `  
scalar JSON
scalar JSONObject
`;

const dateTimeScalarTypeDefs = `
scalar DateTime
`;
interface IGenerateCodegenParam {
  schemaPath: string;
  outputFile: string;
  serviceName: string;
}
export const generateCodegen = async ({
  schemaPath,
  outputFile,
  serviceName,
}: IGenerateCodegenParam) => {
  const mainOutputPath = `../../${outputFile}`;
  const mainSchemaPath = path.resolve(
    __dirname,
    `../../${schemaPath}/index.ts`
  );

  const { typeDefs } = await import(mainSchemaPath);

  const schema: GraphQLSchema = buildASTSchema(
    mergeTypeDefsWithScalarsAndDirectives(typeDefs)
  );

  const config = {
    documents: [],
    config: {},
    filename: mainOutputPath,
    schema: parse(printSchema(schema)),
    plugins: [
      {
        typescript: {
          enumsAsTypes: true,
          skipTypename: true,
          maybeValue: 'T | undefined',
        },
      },
      {
        typescriptResolver: {
          useIndexSignature: true,
          noSchemaStitching: true,
          skipTypename: true,
        },
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptResolver: typescriptResolverPlugin,
    },
  };
  const output = await codegen(config);

  await fs.promises.writeFile(path.join(__dirname, mainOutputPath), output);
  console.log(`Codegen for ${serviceName} outputs generated!`);
};

const generateSchemas = async () => {
  const serviceValues = Object.values(services);

  for (const service of serviceValues) {
    await generateCodegen({
      serviceName: service.serviceName,
      outputFile: service.outputCodegenPath,
      schemaPath: service.schemaPath,
    });
  }
};

export const removeDirectives = (typeDefs: DocumentNode) => {
  return {
    ...typeDefs,
    definitions: typeDefs.definitions.filter(
      (d) => d.kind !== 'DirectiveDefinition'
    ),
  };
};

export const mergeTypeDefsWithScalarsAndDirectives = (
  typeDefs: DocumentNode
): DocumentNode => {
  return mergeTypeDefs([
    allStitchingDirectivesTypeDefs,
    accessdDirectiveTypeDefs,
    authorizedDirectiveTypeDefs,
    jsonScalarTypeDefs,
    dateTimeScalarTypeDefs,
    typeDefs,
    gql`
      type Query {
        _sdl: String!
      }
    `,
  ]);
};

generateSchemas().then(() => {
  console.log('🚀 generate all services schemas 🚀');
});
