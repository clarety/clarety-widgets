import { nextId } from 'shared/utils';
import { types } from 'shared/actions';

const initialState = [];

export const panelManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setPanels:       return setPanels(state, action);
    case types.insertPanels:    return insertPanels(state, action);
    case types.removePanels:    return removePanels(state, action);
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

function insertPanels(state, action) {

  // TODO: just pass an index to this action?
  const index = state.findIndex(panel => panel.component === action.afterComponent) + 1;

  const panels = action.panels.map(panel => ({
    id: nextId(),
    component: panel.component || null,
    status: panel.status || 'wait',
    isValid: panel.isValid || false,
    data: panel.data || {},
  }));

  const newState = state.slice();
  newState.splice(index, 0, ...panels);

  return newState;
}

function removePanels(state, action) {
  return state.filter(panel => panel.component !== action.withComponent);
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
