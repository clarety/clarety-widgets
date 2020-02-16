export function createStartDateOptions(startDays) {
  const options = startDays.map(startDay => {
    const date = getStartDate(startDay);
    return {
      value: getValueForDate(date),
      label: getLabelForDate(date),
    }
  });

  return options.sort((a, b) => a.value.localeCompare(b.value));
}

function getStartDate(startDay) {
  const date = new Date();

  if (startDay < date.getDate()) {
    date.setMonth(date.getMonth() + 1);
  }

  date.setDate(startDay);

  return date;
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
