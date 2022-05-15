import { nanoid } from 'nanoid';
import { Client } from '../generated';

interface ICreateProjectParam {
  customProjectName?: string;
  client?: Client;
}

export function createProject({
  client,
  customProjectName,
}: ICreateProjectParam) {
  const projectName = customProjectName
    ? customProjectName
    : `MOCK_PROJECT_${nanoid()}`;

  return client.chain.mutation
    .createProject({
      input: {
        name: projectName,
      },
    })
    .get({
      id: true,
      name: true,
    });
}
interface IDeleteProjectParam {
  id: string;
  client?: Client;
}

export function deleteProject({ client, id }: IDeleteProjectParam) {
  return client.chain.mutation
    .deleteProject({
      id,
    })
    .success.get();
}

interface ICreateProjectTagParam {
  client: Client;
  tag?: string;
}
export function createProjectTag({ client, tag }: ICreateProjectTagParam) {
  return client.chain.mutation
    .createProjectTag({
      input: {
        tag: tag ?? `MOCK_PROJECT_TAG_${nanoid()}`,
      },
    })
    .get({
      projectId: true,
      id: true,
      tag: true,
    });
}
