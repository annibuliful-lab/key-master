import { redisClient, Repository } from '@key-master/db';
import { IAppContext } from '@key-master/graphql';
import { AuthenticationError } from 'apollo-server-fastify';
import { verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import { LoginInput } from '../codegen-generated';

export class AuthService extends Repository<IAppContext> {
  async login({ username, password }: LoginInput) {
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
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = sign(
      {
        userId: user.id,
        fullname: user.fullname,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      id: user.id,
      fullname: user.fullname,
      token,
      refreshToken,
    };
  }

  async logout() {
    const userId = this.context.userId;
    if (!userId) {
      throw new AuthenticationError('Unauthorization');
    }

    const userProjects = await this.db.project.findMany({
      select: {
        id: true,
      },
      where: {
        OR: [
          {
            ownerId: userId,
            deletedAt: null,
          },
          {
            projectRoleUsers: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        ],
      },
    });

    const redisKeys = [
      `${userId}-null`,
      ...userProjects.map((project) => `${userId}-${project.id}`),
    ];

    await redisClient.del(...redisKeys);

    return { success: true };
  }
}
