import { types } from 'shared/actions';
import { getCurrentPanelIndex, getIndexOfPanelWithComponent } from 'shared/selectors';

export const setPanels = panels => ({
  type: types.setPanels,
  panels: panels,
});

export const insertPanels = ({ afterComponent, atIndex, panels }) => ({
  type: types.insertPanels,
  afterComponent: afterComponent,
  atIndex: atIndex,
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

export const jumpToPanel = ({ component, atIndex }) => {
  return async (dispatch, getState) => {
    const state = getState();

    const jumpToPanelIndex = atIndex ?? getIndexOfPanelWithComponent(state, component);
    if (jumpToPanelIndex !== null && jumpToPanelIndex !== undefined) {
      const currentPanelIndex = getCurrentPanelIndex(state);
      dispatch(setPanelStatus(currentPanelIndex, 'wait'));
      dispatch(setPanelStatus(jumpToPanelIndex, 'edit'));
    }
  };
};
