export function formatDate(dateString) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const date = new Date(dateString);
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}
