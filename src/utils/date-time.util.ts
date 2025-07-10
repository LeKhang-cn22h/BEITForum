import { format } from 'date-fns';

export function formatDateTime(input: Date | string): string {
  const date = new Date(input);
  return format(date, 'dd/MM/yyyy hh:mm a');
}
