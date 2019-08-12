import { types } from '.';

export const panels = {
  contactDetailsPanel:  'CONTACT_DETAILS_PANEL',
  personalDetailsPanel: 'PERSONAL_DETAILS_PANEL',
  shippingDetailsPanel: 'SHIPPING_DETAILS_PANEL',
  shippingOptionsPanel: 'SHIPPING_OPTIONS_PANEL',
  paymentDetailsPanel:  'PAYMENT_DETAILS_PANEL',
};

export const panelStatuses = {
  wait: 'wait',
  edit: 'edit',
  done: 'done',
};

export const setPanels = panels => ({
  type: types.setPanels,
  panels: panels,
});

export const nextPanel = () => ({
  type: types.nextPanel,
});

export const editPanel = index => ({
  type: types.editPanel,
  index: index,
});

export const resetShippingOptionsPanel = () => ({
  type: types.resetShippingOptionsPanel,
});
