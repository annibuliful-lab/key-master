import { ApolloError } from 'apollo-server-errors';

export class ResourceNotFound extends ApolloError {
  constructor(message: string) {
    super(message, 'RESOURCE_NOT_FOUND');

    Object.defineProperty(this, 'name', { value: 'ResourceNotFound' });
  }
}
