import { types } from '.';

export const panels = {
  contactDetailsPanel:  'contact-details-panel',
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

export const resetPanel = panelName => ({
  type: types.resetPanel,
  name: panelName,
});

export const resetPanels = () => ({
  type: types.resetPanels,
});
