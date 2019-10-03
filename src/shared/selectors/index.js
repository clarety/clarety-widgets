export const getSettings = state => state.settings;

export const getSetting = (state, setting) => getSettings(state)[setting];
