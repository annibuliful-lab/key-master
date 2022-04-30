import { Repository } from '@key-master/db';
import { Authentication, IAppContext, LoginInput } from '@key-master/graphql';
import { AuthenticationError } from 'apollo-server-fastify';
import { verify } from 'argon2';
import { sign } from 'jsonwebtoken';

export class AuthService extends Repository<IAppContext> {
  async login({
    username,
    password,
  }: LoginInput): Promise<Omit<Authentication, 'user'>> {
    const user = await this.db.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new AuthenticationError(
        `login: username ${username} not found or password incorrect`
      );
    }

    const isPasswordCorrect = await verify(user.password, password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError(
        `login: username ${username} not found or password incorrect`
      );
    }

    const token = sign(
      {
        userId: user.id,
        fullname: user.fullname,
      },
      process.env.JWT_SCRET,
      { expiresIn: '1h' }
    );

    const refreshToken = sign(
      {
        userId: user.id,
        fullname: user.fullname,
      },
      process.env.JWT_SCRET,
      { expiresIn: '7d' }
    );

    return {
      id: user.id,
      fullname: user.fullname,
      token,
      refreshToken,
    };
  }
}
