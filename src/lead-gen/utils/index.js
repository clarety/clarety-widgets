export const settingsMap = (result) => {
  const sos = result.sos || result.Sos;

  return {
    sos: {
      current: sos.current || sos.actual,
      goal: sos.goal,
    },
  };
};
