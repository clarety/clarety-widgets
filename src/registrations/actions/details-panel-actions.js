import { panels, pushPanel } from 'registrations/actions';
import { createRegistration } from 'registrations/actions';
import { calcProgress } from 'registrations/utils';

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
