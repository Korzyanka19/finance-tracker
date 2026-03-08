export const formatSmart = (num: number) => {
  const absNum = Math.abs(num);
  if (absNum >= 1000000000)
    return (num / 1000000000).toFixed(1).replace(".0", "") + "млрд";
  if (absNum >= 1000000)
    return (num / 1000000).toFixed(1).replace(".0", "") + "млн";
  if (absNum >= 10000) return (num / 1000).toFixed(1).replace(".0", "") + "тыс";
  return num.toLocaleString("ru-RU");
};
