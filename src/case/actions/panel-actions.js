import { removePanels, insertPanels, setPanelStatus } from 'shared/actions';
import { getSetting, getIndexOfPanelWithComponent } from 'shared/selectors';
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
          isLastForm: index === sections.length - 1,
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
