import { buildSchema, printSchema, parse, GraphQLSchema } from 'graphql';
import { codegen } from '@graphql-codegen/core';
import * as fs from 'fs';
import * as path from 'path';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptResolverPlugin from '@graphql-codegen/typescript-resolvers';

interface IGenerateCodegenParam {
  schemaString: string;
  outputFile: string;
  serviceName: string;
}
export const generateCodegen = async ({
  schemaString,
  outputFile,
  serviceName,
}: IGenerateCodegenParam) => {
  const schema: GraphQLSchema = buildSchema(schemaString);

  const config = {
    documents: [],
    config: {},
    // used by a plugin internally, although the 'typescript' plugin currently
    // returns the string output, rather than writing to a file
    filename: outputFile,
    schema: parse(printSchema(schema)),
    plugins: [
      // Each plugin should be an object
      {
        typescript: {}, // Here you can pass configuration to the plugin
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptResolver: typescriptResolverPlugin,
    },
  };
  const output = await codegen(config);
  await fs.promises.writeFile(path.join(__dirname, outputFile), output);
  console.log(`Codegen for ${serviceName} outputs generated!`);
};
