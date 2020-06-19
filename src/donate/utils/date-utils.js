import { formatDate } from 'shared/utils';

export function createStartDateOptions(startDates) {
  return startDates.map(startDate => ({
    value: startDate,
    label: formatDate(startDate),
  }));
}
