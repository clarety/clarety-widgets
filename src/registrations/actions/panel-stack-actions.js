import { calcProgress } from 'registrations/utils';
import { createRegistration } from 'registrations/actions';
import { types } from 'shared/actions';

export const panels = {
  eventPanel:   'EVENT_PANEL',
  qtysPanel:    'QTYS_PANEL',
  namesPanel:   'NAMES_PANEL',
  detailsPanel: 'DETAILS_PANEL',
  teamPanel:    'TEAM_PANEL',
  donatePanel:  'DONATE_PANEL',
  reviewPanel:  'REVIEW_PANEL',
};

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
