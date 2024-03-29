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
  return action.panels.map((panel, index) => ({
    id: nextId(),
    component: panel.component ? panel.component.name : null,
    connect: panel.connect ? panel.connect.name : null,
    status: panel.status || (index == 0 ? 'edit' : 'wait'),
    isValid: false,
    data: panel.data || {},
  }));
}

function insertPanels(state, action) {
  let index;

  if (action.atIndex !== undefined) {
    index = action.atIndex;
  }

  if (action.afterComponent) {
    index = 1 + state.findIndex(panel => panel.component === action.afterComponent);
  }

  const panels = action.panels.map(panel => ({
    id: nextId(),
    component: toString(panel.component),
    connect: toString(panel.connect),
    status: panel.status || 'wait',
    isValid: panel.isValid || false,
    data: panel.data || {},
  }));

  const newState = state.slice();
  newState.splice(index, 0, ...panels);

  return newState;
}

function toString(classOrString) {
  if (!classOrString) return null;

  // Already a string.
  if (typeof classOrString === 'string') return classOrString;

  // Use the name of the class.
  return classOrString.name;
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
