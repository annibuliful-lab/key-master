import { decryptMaterKey, encryptMasterKey } from '../utils/key-encryption';
const SECRET =
  '$argon2i$v=19$m=4096,t=3,p=1$eaVVI3+cTS0H9lVNXnONpg$bH1RXcMeogJfcuxyw5TqyPYsOsox1LDQyQd4FWSPxM0';

describe('Key Encryption', () => {
  it('creates new encryption', () => {
    const text = 'MOCK_TEXT';
    const hash = encryptMasterKey({ text, secret: SECRET });
    const decrpytedText = decryptMaterKey({
      hash,
      secretHash: hash.secretHash,
    });
    expect(text).toEqual(decrpytedText);
  });
});
