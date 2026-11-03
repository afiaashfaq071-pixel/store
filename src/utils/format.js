export const formatPKR = (amount) =>
  `Rs. ${Math.round(Number(amount) || 0).toLocaleString('en-PK')}`;

export const FREE_DELIVERY_THRESHOLD = 3000;
export const DELIVERY_FEE = 199;
