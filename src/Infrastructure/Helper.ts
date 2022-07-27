import { decode } from 'html-entities';

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const cleanString = (str: string): string => {
  return decode(str);
};

export const formatCLP = (amount: number): string => {
  return Intl.NumberFormat('es-CL').format(amount);
};
