import { format } from 'date-fns';

export function formatDate(dateString) {
  const date = new Date(dateString);
  return format(date, 'd MMMM yyyy');
}
