export const settingsMap = (result) => {
  const settings = {};

  const sos = result.sos || result.Sos;

  if (sos) {
    settings.sos = {
      current: Number(sos.actual),
      goal: Number(sos.goal),
    };
  }

  const download = result.download || result.Download;

  if (download) {
    settings.download = {
      image: download.coverImage,
      file: download.file,
    };
  }

  return settings;
};
