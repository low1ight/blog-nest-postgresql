export const isDateExpired = (date: Date) => {
  return date.toISOString() < new Date().toISOString();
};
