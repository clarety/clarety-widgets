import { calcProgress } from 'registrations/utils';
import { createRegistration, types } from 'registrations/actions';

export const panels = {
  eventPanel:   'event-panel',
  qtysPanel:    'qtys-panel',
  namesPanel:   'names-panel',
  detailsPanel: 'details-panel',
  reviewPanel:  'review-panel',
};

export const panelStatuses = {
  wait: 'wait',
  edit: 'edit',
  done: 'done',
};

export const pushPanel = ({ name, data }) => ({
  type: types.panelsPush,
  name: name,
  data: data,
});

export const popToPanel = index => ({
  type: types.panelsPop,
  index,
});

export const updatePanelData = (index, data) => ({
  type: types.updatePanelData,
  index: index,
  data: data,
});

export const pushNextDetailsPanel = participantIndex => {
  return (dispatch, getState) => {
    const state = getState();
    const participantCount = state.panelData.participants.length;

    const hasNext = participantIndex < participantCount;
    if (hasNext) {
      dispatch(pushPanel({
        name: panels.detailsPanel,
        data: {
          progress: calcProgress(participantCount, participantIndex),
          participantIndex: participantIndex,
        },
      }));
    } else {
      dispatch(createRegistration());
    }
  };
};
