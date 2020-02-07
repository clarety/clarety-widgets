import { getSetting } from 'shared/selectors';
import { getCmsConfirmContentFields } from 'subscribe/selectors';

export class CmsConfirmConnect {
  static mapStateToProps = (state) => {
    const fields = getSetting(state, 'isShowingConfirmation')
      ? getCmsConfirmContentFields(state)
      : [];

    return {
      elementId: getSetting(state, 'widgetElementId'),
      fields: fields,
    };
  };

  static actions = {};
}
