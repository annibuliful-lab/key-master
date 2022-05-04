interface IService {
  serviceName: string;
  commandArg: string;
  port: number;
  appPath: string;
  schemaPath: string;
  outputCodegenPath: string;
}

const baseAppPath = 'src';
const baseSchemaPath = 'schemas';
const baseOutputCodegenPath = 'codegen-generated.ts';

const userService: IService = {
  serviceName: 'User',
  commandArg: '',
  port: 3000,
  appPath: `apps/user-backend/${baseAppPath}`,
  schemaPath: 'apps/user-backend/src/schemas',
  outputCodegenPath: 'apps/user-backend/src/codegen-generated.ts',
};

const authService: IService = {
  serviceName: 'Authentication',
  commandArg: '',
  port: 3001,
  appPath: `apps/auth-backend/${baseAppPath}`,
  schemaPath: `apps/auth-backend/${baseAppPath}/${baseSchemaPath}`,
  outputCodegenPath: `apps/auth-backend/${baseAppPath}/${baseOutputCodegenPath}`,
};

export const services = {
  authService,
  userService,
};
