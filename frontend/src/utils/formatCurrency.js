export const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);

  const nf = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}₹ ${nf.format(abs)}`;
};

export const formatCurrencyNoSign = (value) => {
  const amount = Math.abs(Number(value) || 0);
  const nf = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹ ${nf.format(amount)}`;
};

