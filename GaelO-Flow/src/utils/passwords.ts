import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';

export const hashPassword = async (password: string) => {
  const saltTest = await bcryptjs.genSalt();
  const hash = await bcryptjs.hash(password, saltTest);
  return hash;
};

export const generateToken = async () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = await hashPassword(token);
  return { token, hash };
};
