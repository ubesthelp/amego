export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const capitalizeObject = <T extends object>(obj: T) => (
  Object.entries(obj).reduce<object>((prev, [key, value]) => ({
    ...prev,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    [capitalize(key)]: value,
  }), {})
);
