import { types } from 'shared/actions';

const initialState = [];

export const panelStackReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setPanels:       return setPanels(state, action);
    case types.nextPanel:       return nextPanel(state, action);
    case types.editPanel:       return editPanel(state, action);
    case types.pushPanel:       return pushPanel(state, action);
    case types.popToPanel:      return popToPanel(state, action);
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

function nextPanel(state, action) {
  let foundNext = false;

  return state.map(panel => {
    // Set current panel status to 'done'.
    if (panel.status === 'edit') {
      return {
        ...panel,
        status: 'done',
        isValid: true,
      };
    }

    // Set next invalid panel status to 'edit'.
    if (!foundNext && !panel.isValid) {
      foundNext = true;
      return {
        ...panel,
        status: 'edit',
      };
    }

    return panel;
  });
}

function editPanel(state, action) {
  return state.map((panel, index) => {
    // Set status of current panel to 'wait'.
    if (panel.status === 'edit') {
      return {
        ...panel,
        status: 'wait',
      };
    }

    // Set status of panel at index to 'edit'.
    if (index === action.index) {
      return {
        ...panel,
        status: 'edit',
        isValid: false,
      };
    }

    return panel;
  });
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
