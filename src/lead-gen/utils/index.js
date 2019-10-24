export const settingsMap = (result) => {
  const sos = result.sos || result.Sos;

  return {
    sos: {
      current: Number(sos.current || sos.actual),
      goal: Number(sos.goal),
    },
  };
};
