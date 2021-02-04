import { getSettings, getParsedFormData, getTrackingData } from 'shared/selectors';

export const getCampaignPostData = (state) => {
  const settings = getSettings(state);
  const { campaign } = getParsedFormData(state);
  const trackingData = getTrackingData(state);

  return {
    campaignName: campaign.name,
    goal: campaign.goal,
    storeUid: settings.storeUid,
    teamId: settings.teamId,
    seriesId: settings.seriesId,
    pageType: settings.pageType,
    ...trackingData,
  };
};
