import { types, panels, panelStatuses, emailStatuses } from 'checkout/actions';

const initialState = [
  {
    name: panels.loginPanel,
    status: panelStatuses.edit,
    isValid: false,
    fields: [
      'customer.email',
      'customer.password',
    ],
    data: {
      emailStatus: emailStatuses.notChecked,
    },
  },
  {
    name: panels.personalDetailsPanel,
    status: panelStatuses.wait,
    isValid: false,
    fields: [
      'customer.firstName',
      'customer.lastName',
      'customer.homePhone',
      'customer.workPhone',
      'customer.mobilePhone',
      'customer.dateOfBirthDay',
      'customer.dateOfBirthMonth',
      'customer.dateOfBirthYear',
      'sale.source',
    ],
    data: {},
  },
  {
    name: panels.shippingDetailsPanel,
    status: panelStatuses.wait,
    isValid: false,
    fields: [
      'customer.delivery.address1',
      'customer.delivery.suburb',
      'customer.delivery.state',
      'customer.delivery.postcode',
      'customer.billing.address1',
      'customer.billing.suburb',
      'customer.billing.state',
      'customer.billing.postcode',
    ],
    data: {},
  },
  {
    name: panels.shippingOptionsPanel,
    status: panelStatuses.wait,
    isValid: false,
    fields: [
      'sale.shippingOption',
    ],
    data: {},
  },
  {
    name: panels.paymentDetailsPanel,
    status: panelStatuses.wait,
    isValid: false,
    fields: [
      'payment.cardName',
      'payment.cardNumber',
      'payment.cardExpiry',
      'payment.ccv',
    ],
    data: {},
  },
];

export const panelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.nextPanel:        return nextPanel(state, action);
    case types.editPanel:        return editPanel(state, action);
    case types.invalidatePanel:  return invalidatePanel(state, action);
    case types.resetPanels:      return resetPanels(state, action);

    // TODO: should the LoginPanel have it's own reducer?
    case types.hasAccountRequest: return resetEmailStatus(state, action);
    case types.hasAccountSuccess: return hasAccountSuccess(state, action);
    case types.resetEmailStatus:  return resetEmailStatus(state, action);
    case types.logout:            return resetEmailStatus(state, action);

    default: return state;
  }
};

function hasAccountSuccess(state, action) {
  return state.map(panel => {
    if (panel.name !== panels.loginPanel) return panel;

    return {
      ...panel,
      data: {
        ...panel.data,
        emailStatus: action.result.exists ? emailStatuses.hasAccount : emailStatuses.noAccount,
      },
    };
  });
}

function resetEmailStatus(state, action) {
  return state.map(panel => {
    if (panel.name !== panels.loginPanel ) return panel;
    
    return {
      ...panel,
      data: {
        ...panel.data,
        emailStatus: emailStatuses.notChecked,
      },
    };
  });
}

function nextPanel(state, action) {
  let foundNext = false;

  return state.map(panel => {
    // Set current panel status to 'done'.
    if (panel.status === panelStatuses.edit) {
      return {
        ...panel,
        status: panelStatuses.done,
        isValid: true,
      };
    }

    // Set next invalid panel status to 'edit'.
    if (!foundNext && !panel.isValid) {
      foundNext = true;
      return {
        ...panel,
        status: panelStatuses.edit,
      };
    }

    return panel;
  });
}

function editPanel(state, action) {
  return state.map((panel, index) => {
    // Set status of current panel to 'wait'.
    if (panel.status === panelStatuses.edit) {
      return {
        ...panel,
        status: panelStatuses.wait,
      };
    }

    // Set status of panel at index to 'edit'.
    if (index === action.index) {
      return {
        ...panel,
        status: panelStatuses.edit,
        isValid: false,
      };
    }

    return panel;
  });
}

function resetPanels(state, action) {
  return state.map((panel, index) => ({
    ...panel,
    status: index === 0 ? panelStatuses.edit : panelStatuses.wait,
    isValid: false,
  }));
}

function invalidatePanel(state, action) {
  return state.map(panel => {
    if (panel.name === action.name) {
      return {
        ...panel,
        status: panelStatuses.wait,
        isValid: false,
      };
    }

    return panel;
  });
}