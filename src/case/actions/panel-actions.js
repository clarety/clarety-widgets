import { removePanels, insertPanels, setPanelStatus, invalidatePanel } from 'shared/actions';
import { getSetting, getPanelManager, getIndexOfPanelWithComponent, getCurrentPanelIndex } from 'shared/selectors';
import { CaseFormPanel, CaseFormConnect } from 'case/components';

export const setupFormPanels = () => {
  return async (dispatch, getState) => {
    const state = getState();

    const extendForm = getSetting(state, 'extendForm');
    if (extendForm.sections) {
      // Remove existing case form panel.
      const index = getIndexOfPanelWithComponent(state, 'CaseFormPanel');
      dispatch(removePanels({ withComponent: 'CaseFormPanel' }));

      // Setup a case form panel for each section.
      const sections = ['customer'];
      extendForm.sections.forEach((_, index) => sections.push(index));

      const panels = sections.map((section, index) => ({
        component: CaseFormPanel,
        connect: CaseFormConnect,
        data: {
          section: section,
          isLastSection: index === sections.length - 1,
        },
      }));

      dispatch(insertPanels({
        atIndex: index,
        panels: panels,
      }));

      dispatch(setPanelStatus(0, 'edit'));
    }    
  };
};

export const jumpToSection = (section) => {
  return async (dispatch, getState) => {
    const state = getState();
    const panels = getPanelManager(state);

    // 'wait' all panels after the section we're jumping to.
    panels.forEach((panel, index) => {
      if (panel.data.section > section || (section === 'customer' && panel.data.section !== 'customer')) {
        dispatch(setPanelStatus(index, 'wait'));
      }
    });

    // 'edit' the panel with the section we're jumping to.
    const nextPanelIndex = panels.findIndex(panel => panel.data.section === section);
    dispatch(setPanelStatus(nextPanelIndex, 'edit'));
  }
};
