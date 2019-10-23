import { types } from 'shared/actions';

export const initialState = {};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.updateSettings:       return updateSettings(state, action.settings);
    case types.fetchSettingsSuccess: return updateSettings(state, action.result);
    case types.setPanels:            return setPanelSettings(state, action);
    case types.updatePanelSettings:  return updatePanelSettings(state, action);
    default:                         return state;
  }
};

function updateSettings(state, settings) {
  return {
    ...state,
    ...settings,
  };
}

function setPanelSettings(state, action) {
  return {
    ...state,
    panels: action.panels.reduce((panels, panel) => {
      panels[panel.component.name] = panel.settings;
      return panels;
    }, {}),
  };
}

function updatePanelSettings(state, action) {
  return {
    ...state,
    panels: {
      ...state.panels,
      [action.component]: {
        ...state.panels[action.component],
        ...action.settings,
      }
    },
  };
}
