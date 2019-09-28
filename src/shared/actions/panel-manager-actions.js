import { types } from 'shared/actions';

export const panelStatuses = {
  wait: 'wait',
  edit: 'edit',
  done: 'done',
};

export const setPanels = panels => ({
  type: types.setPanels,
  panels: panels,
});

export const pushPanel = ({ component, data }) => ({
  type: types.pushPanel,
  component: component,
  data: data,
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

export const invalidatePanel = ({ component }) => ({
  type: types.invalidatePanel,
  component: component,
});

export const resetAllPanels = () => ({
  type: types.resetAllPanels,
});
