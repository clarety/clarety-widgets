import { parseISO, format } from 'date-fns';

export const settingsMap = settings => {
  return {
    sessions: settings.sessions.map(session => ({
      sessionUid:  session.sessionUid,
      date:        session.date,
      endTime:     session.endTime,
      startTime:   session.startTime,
      displayDate: getDisplayDate(session),
      name:        session.name,
    })),
  };
};

function getDisplayDate(session) {
  const startDate = parseISO(session.date + ' ' + session.startTime);
  const endDate = parseISO(session.date + ' ' + session.endTime);

  const startTime = format(startDate, "h:mmaaaaa'm'");
  const endTime = format(endDate, "h:mmaaaaa'm'");
  const date = format(startDate, 'eeee d MMMM yyyy');
  
  return `${startTime} - ${endTime} ${date}`;
}
