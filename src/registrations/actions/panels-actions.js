import { calcProgress } from 'registrations/utils';
import { createRegistration, types } from 'registrations/actions';

export const panels = {
  eventPanel:   'event-panel',
  qtysPanel:    'qtys-panel',
  namesPanel:   'names-panel',
  detailsPanel: 'details-panel',
  reviewPanel:  'review-panel',
};

export const pushPanel = ({ panel, progress, props }) => ({
  type: types.panelsPush,
  panel,
  progress,
  props,
});

export const popToPanel = index => ({
  type: types.panelsPop,
  index,
});

export const pushNextDetailsPanel = participantIndex => {
  return (dispatch, getState) => {
    const state = getState();
    const participantCount = state.panelData.participants.length;

    const hasNext = participantIndex < participantCount;
    if (hasNext) {
      dispatch(pushPanel({
        panel: panels.detailsPanel,
        progress: calcProgress(participantCount, participantIndex),
        props: { participantIndex },
      }));
    } else {
      dispatch(createRegistration());
    }
  };
};
