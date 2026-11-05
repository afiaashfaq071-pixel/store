// Order statuses and the allowed moves between them (the database enforces the same rules).
export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export const ORDER_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: [],
};

export const allowedNext = (status) => ORDER_TRANSITIONS[status] || [];

export const canTransition = (from, to) => allowedNext(from).includes(to);

/** A "sale" is any order that was not cancelled. */
export const isSale = (order) => order.status !== 'Cancelled';
