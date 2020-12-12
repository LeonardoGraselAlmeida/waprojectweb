import { IMaskFunction } from '.';

const number: IMaskFunction = {
  apply: (value: string) => {
    if (!value) return null;
    return value;
  },
  clean: (value: string) => parseInt(value)
};

export default number;
