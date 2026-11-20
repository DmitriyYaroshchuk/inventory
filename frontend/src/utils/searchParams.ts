type SearchParamValue = string | string[] | undefined;

export const parseId = (value: SearchParamValue): number | null => {
  if (typeof value !== 'string') return null;

  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
};
