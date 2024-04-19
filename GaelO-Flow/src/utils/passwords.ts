import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';

export const hashPassword = async (password: string) => {
  const saltTest = await bcryptjs.genSalt();
  const hash = await bcryptjs.hash(password, saltTest);
  return hash;
};

export const comparePasswords = async (password: string, hash: string) => {
  return bcryptjs.compare(password, hash);
};

export const generateToken = async () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = await hashPassword(token);
  return { token, hash };
};

export const generateRandomUUID = () => {
  const jobId = randomUUID();
  return jobId;
}
