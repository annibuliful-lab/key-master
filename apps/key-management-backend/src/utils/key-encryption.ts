import * as crypto from 'crypto';
const algorithm = 'aes-256-ctr';

interface IEncryptKeyParam {
  text: string;
  secret: string;
}

const makeid = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateMasterKey = (
  hash: string,
  replace = '$argon2i$v=19$m=4096,t=3,p=1$'
) => {
  const key = makeid(32);
  const secretHash = crypto
    .createHash('md5')
    .update(hash.replace(replace, '').substring(0, hash.length - 1))
    .digest('hex');

  return { secretHash, key };
};

export const encryptMasterKey = ({ text, secret }: IEncryptKeyParam) => {
  const { key, secretHash } = generateMasterKey(secret);

  const iv = makeid(16);

  const cipher = crypto.createCipheriv(algorithm, secretHash, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: Buffer.from(iv).toString('base64'),
    content: encrypted.toString('base64'),
    key: Buffer.from(key).toString('base64'),
    secretHash,
  };
};

interface IDecryptKeyParam {
  hash: {
    iv: string;
    content: string;
  };
  secretHash: string;
}

export const decryptMaterKey = ({
  hash: { iv, content },
  secretHash,
}: IDecryptKeyParam) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretHash, 'utf-8'),
    Buffer.from(iv, 'base64')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, 'base64')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
