import md5 from 'md5';

export const generateMd5 = () => {
  const randomNumber = Math.random();
  return md5(randomNumber);
};
