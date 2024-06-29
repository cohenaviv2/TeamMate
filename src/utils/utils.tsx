export const setNestedProperty = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
  if (lastKey) lastObj[lastKey] = value;
  return { ...obj };
};
