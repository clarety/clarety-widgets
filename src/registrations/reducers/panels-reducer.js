import { types, panelStatuses } from 'registrations/actions';

const initialState = [];

export const panelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.panelsPush:      return panelsPush(state, action);
    case types.panelsPop:       return panelsPop(state, action);
    case types.updatePanelData: return updatePanelData(state, action);
    default:                    return state;
  }
};

function panelsPush(state, action) {
  // Set existing panels status to 'done'.
  const panels = state.map(panel => ({
    ...panel,
    status: panelStatuses.done,
  }));

  // Push new panel.
  panels.push({
    name: action.name,
    status: panelStatuses.edit,
    isValid: true,
    fields: [],
    data: action.data || {},
  });

  return panels;
}

function panelsPop(state, action) {
  const panels = state.slice(0, action.index + 1);
  panels[action.index].status = panelStatuses.edit;

  return panels;
}

function updatePanelData(state, action) {
  return state.map((panel, index) => {
    if (action.index !== index) return panel;

    return {
      ...panel,
      data: {
        ...panel.data,
        ...action.data,
      }
    };
  });
}
