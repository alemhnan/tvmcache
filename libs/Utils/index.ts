import { Cast } from '../Interfaces';

export const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sortByBirthday = ({ birthday: a }: Cast, { birthday: b }: Cast): number => {
  try {
    if (!a) {
      return 1;
    }
    if (!b) {
      return -1;
    }

    const aD = new Date(a);
    const bD = new Date(b);

    if (aD > bD) {
      return -1;
    }

    if (aD < bD) {
      return 1;
    }

    return 0;
  } catch (error) {
    return 0;
  }
};
