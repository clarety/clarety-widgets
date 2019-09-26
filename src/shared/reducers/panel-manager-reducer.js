import { types } from 'shared/actions';

const initialState = [];

export const panelManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setPanels:       return setPanels(state, action);
    case types.pushPanel:       return pushPanel(state, action);
    case types.popToPanel:      return popToPanel(state, action);
    case types.setPanelStatus:  return setPanelStatus(state, action);
    case types.invalidatePanel: return invalidatePanel(state, action);
    case types.resetPanels:     return resetPanels(state, action);
    default:                    return state;
  }
};

function setPanels(state, action) {
  return action.panels.map((name, index) => ({
    name: name,
    status: index === 0 ? 'edit' : 'wait',
    isValid: false,
  }));
}

function pushPanel(state, action) {
  return [
    ...state,
    {
      name: action.panel,
      progress: action.progress,
      props: action.props,
    },
  ];
}

function popToPanel(state, action) {
  return state.slice(0, action.index + 1);
}

function setPanelStatus(state, action) {
  return state.map((panel, index) => {
    if (index === action.index) {
      return {
        ...panel,
        status: action.status,
      };
    }

    return panel;
  });
}

function resetPanels(state, action) {
  return state.map((panel, index) => ({
    ...panel,
    status: index === 0 ? 'edit' : 'wait',
    isValid: false,
  }));
}

function invalidatePanel(state, action) {
  return state.map(panel => {
    if (panel.name === action.name) {
      return {
        ...panel,
        status: 'wait',
        isValid: false,
      };
    }

    return panel;
  });
}
