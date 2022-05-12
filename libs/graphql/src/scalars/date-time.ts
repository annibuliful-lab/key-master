import { gql } from 'graphql-tag';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLScalarType, Kind } from 'graphql';
import { UserInputError } from 'apollo-server-fastify';

export const dateTimeScalarTypeDefs = gql`
  scalar DateTime
`;

export const dateTimeScalarResolver: IResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Date custom scalar type',
    serialize(value) {
      const dateValue: Date = (() => {
        if (typeof value === 'string') {
          return new Date(value);
        }

        if (typeof value === 'number') {
          return new Date(value);
        }

        if (value instanceof Date) {
          return value;
        }

        throw Error('Invalid Date format');
      })();

      return dateValue.toISOString().replace(/Z$/, '');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseValue(value: any) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new UserInputError('Invalid date format');
      }

      return new Date(value);
    },
    parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.INT: {
          return new Date(parseInt(ast.value, 10));
        }
        case Kind.STRING: {
          const date = new Date(ast.value);
          if (isNaN(date.getTime())) {
            throw new UserInputError('Invalid date format');
          }

          return date;
        }
        default:
          return null;
      }
    },
  }),
};
