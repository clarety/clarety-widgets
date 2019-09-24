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
