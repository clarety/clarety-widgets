import { getSettings, getParsedFormData } from 'shared/selectors';

export const getCampaignPostData = (state) => {
  const settings = getSettings(state);
  const { campaign } = getParsedFormData(state);

  return {
    campaignName: campaign.name,
    goal: campaign.goal,
    seriesId: settings.seriesId,
    pageType: settings.pageType,
  };
};
