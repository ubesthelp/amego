import { createHash } from 'crypto';

const md5 = (s: string) => {
  const hash = createHash('md5');
  hash.update(s, 'utf-8');
  return hash.digest('hex');
};

export default md5;
