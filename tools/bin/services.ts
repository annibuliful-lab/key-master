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
  schemaPath: `apps/user-backend/${baseAppPath}/${baseSchemaPath}`,
  outputCodegenPath: `apps/user-backend/${baseAppPath}/${baseOutputCodegenPath}`,
};

const authService: IService = {
  serviceName: 'Authentication',
  commandArg: '',
  port: 3001,
  appPath: `apps/auth-backend/${baseAppPath}`,
  schemaPath: `apps/auth-backend/${baseAppPath}/${baseSchemaPath}`,
  outputCodegenPath: `apps/auth-backend/${baseAppPath}/${baseOutputCodegenPath}`,
};

const projectService: IService = {
  serviceName: 'Project',
  commandArg: '',
  port: 3002,
  appPath: `apps/project-backend/${baseAppPath}`,
  schemaPath: `apps/project-backend/${baseAppPath}/${baseSchemaPath}`,
  outputCodegenPath: `apps/project-backend/${baseAppPath}/${baseOutputCodegenPath}`,
};

const keyManagementService: IService = {
  serviceName: 'KeyManagement',
  commandArg: '',
  port: 3003,
  appPath: `apps/key-management-backend/${baseAppPath}`,
  schemaPath: `apps/key-management-backend/${baseAppPath}/${baseSchemaPath}`,
  outputCodegenPath: `apps/key-management-backend/${baseAppPath}/${baseOutputCodegenPath}`,
};

export const services = {
  authService,
  userService,
  projectService,
  keyManagementService,
};
