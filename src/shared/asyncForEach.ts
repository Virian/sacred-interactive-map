const asyncForEach = <T>(
  arr: Array<T>,
  callback: (value: T, index: number, array: Array<T>) => Promise<unknown>,
) => Promise.all(arr.map(callback));

export default asyncForEach;
