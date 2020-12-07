export const settingsMap = (result) => {
  const settings = {
    elements: result.elements,
  };

  if (result.sos) {
    settings.sos = {
      current: Number(result.sos.actual),
      goal: Number(result.sos.goal),
    };
  }

  if (result.download) {
    settings.download = {
      image: result.download.coverImage,
      file: result.download.file,
    };
  }

  return settings;
};
