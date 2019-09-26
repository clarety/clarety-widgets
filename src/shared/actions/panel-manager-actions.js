import { types } from 'shared/actions';

export const panels = {
  eventPanel:   'event-panel',
  qtysPanel:    'qtys-panel',
  namesPanel:   'names-panel',
  detailsPanel: 'details-panel',
  teamPanel:    'team-panel',
  donatePanel:  'donate-panel',
  reviewPanel:  'review-panel',

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

export const setPanels = panels => ({
  type: types.setPanels,
  panels: panels,
});

export const pushPanel = ({ panel, progress, props }) => ({
  type: types.pushPanel,
  panel: panel,
  progress: progress,
  props: props,
});

export const popToPanel = index => ({
  type: types.popToPanel,
  index: index,
});

export const setPanelStatus = (index, status) => ({
  type: types.setPanelStatus,
  index: index,
  status: status,
});

export const invalidatePanel = name => ({
  type: types.invalidatePanel,
  name: name,
});

export const resetPanels = () => ({
  type: types.resetPanels,
});
