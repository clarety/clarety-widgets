import { nextId } from 'shared/utils';
import { types } from 'shared/actions';

const initialState = [];

export const panelManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setPanels:       return setPanels(state, action);
    case types.pushPanel:       return pushPanel(state, action);
    case types.popToPanel:      return popToPanel(state, action);
    case types.setPanelStatus:  return setPanelStatus(state, action);
    case types.invalidatePanel: return invalidatePanel(state, action);
    case types.resetAllPanels:  return resetAllPanels(state, action);
    default:                    return state;
  }
};

function setPanels(state, action) {
  return action.panels.map(panel => ({
    id: nextId(),
    component: panel.component || null,
    status: panel.status || 'wait',
    isValid: false,
    data: {},
  }));
}

function pushPanel(state, action) {
  return [
    ...state,
    {
      id: nextId(),
      component: action.component || null,

      // TODO: use panel status, instead of calculating using stack position.
      // status: action.status || 'wait',
      status: undefined,

      isValid: false,
      data: action.data || {},
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

function resetAllPanels(state, action) {
  return state.map((panel, index) => ({
    ...panel,
    status: index === 0 ? 'edit' : 'wait',
    isValid: false,
  }));
}

function invalidatePanel(state, action) {
  return state.map(panel => {
    if (action.component === panel.component) {
      return {
        ...panel,
        status: 'wait',
        isValid: false,
      };
    }

    return panel;
  });
}
