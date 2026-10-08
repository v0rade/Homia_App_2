export function generateInvoiceNumber(prefix: string = 'INV', date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomStr = Math.random().toString().substring(2, 6);
  return `${prefix}-${year}-${month}-${randomStr}`;
}
