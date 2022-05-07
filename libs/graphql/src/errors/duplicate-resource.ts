import { ApolloError } from 'apollo-server-errors';

export class DuplicateResouce extends ApolloError {
  constructor(message: string) {
    super(message, 'DUPLICATE_RESOURCE');

    Object.defineProperty(this, 'name', { value: 'DuplicateResouce' });
  }
}
