import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

export const sign = (
  payload: jwt.JwtPayload,
  expireDate?: string | number
): string => {
  const expiresIn = expireDate || '2d';
  return jwt.sign({ payload }, secret, { expiresIn });
};

export const verify = <T = unknown>(
  token: string
): { isValid: boolean; userInfo?: T } | undefined => {
  try {
    if (!token) {
      return { isValid: false };
    }

    jwt.verify(token, secret);

    const userInfo = jwt.decode(token) as T;
    return { isValid: true, userInfo };
  } catch (err) {
    return { isValid: false };
  }
};

export const decode = <T = unknown>(token: string) => jwt.decode(token) as T;
