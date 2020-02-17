export function createStartDateOptions(startDays) {
  const options = [];

  for (const startDay of startDays) {
    const date = getStartDate(startDay);
    if (!date) continue;

    options.push({
      value: getValueForDate(date),
      label: getLabelForDate(date),
    });
  }

  return options.sort((a, b) => a.value.localeCompare(b.value));
}

function getStartDate(startDay) {
  const now = new Date();
  let year  = now.getFullYear();
  let month = now.getMonth();
  let today = now.getDate();

  // Use next month if start day is in the past.
  if (startDay <= today) month++;
  
  const date = new Date(year, month, startDay);

  // Only return date if it was valid.
  return date.getFullYear() === year
      && date.getMonth() === month
      && date.getDate() === startDay
    ? date
    : null;
}

function getLabelForDate(date) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function getValueForDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
