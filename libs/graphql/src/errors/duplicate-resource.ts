import { ApolloError } from 'apollo-server-errors';

export class DuplicateResource extends ApolloError {
  constructor(message: string) {
    super(message, 'DUPLICATE_RESOURCE');

    Object.defineProperty(this, 'name', { value: 'DuplicateResource' });
  }
}
