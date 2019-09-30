import { types } from 'shared/actions';

export const setPanels = panels => ({
  type: types.setPanels,
  panels: panels,
});

export const insertPanels = ({ afterComponent, panels }) => ({
  type: types.insertPanels,
  afterComponent: afterComponent,
  panels: panels,
});

export const removePanels = ({ withComponent }) => ({
  type: types.removePanels,
  withComponent: withComponent,
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
