import { types } from '.';

export const panels = {
  loginPanel:           'login-panel',
  personalDetailsPanel: 'personal-details-panel',
  shippingDetailsPanel: 'shipping-details-panel',
  shippingOptionsPanel: 'shipping-options-panel',
  paymentDetailsPanel:  'payment-details-panel',
};

export const panelStatuses = {
  wait: 'wait',
  edit: 'edit',
  done: 'done',
};

export const nextPanel = () => ({
  type: types.nextPanel,
});

export const editPanel = index => ({
  type: types.editPanel,
  index: index,
});

export const updatePanelData = (index, data) => ({
  type: types.updatePanelData,
  index: index,
  data: data,
});

export const invalidatePanel = panelName => ({
  type: types.invalidatePanel,
  name: panelName,
});

export const resetPanels = () => ({
  type: types.resetPanels,
});
