import { generate } from '@genql/cli';
import fs from 'fs';
import path from 'path';
generate({
  schema: fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString(),
  output: path.join(__dirname, 'generated'),
}).catch(console.error);
