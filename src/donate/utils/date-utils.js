export function createStartDateOptions(startDates) {
  return startDates.map(startDate => ({
    value: startDate,
    label: getLabelForDate(startDate),
  }));
}

function getLabelForDate(dateString) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const date = new Date(dateString);
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}
