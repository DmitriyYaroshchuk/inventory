/** Разбирает id из URL; возвращает null, если это не положительное целое. */
export const parseId = (value: string): number | null => {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};
