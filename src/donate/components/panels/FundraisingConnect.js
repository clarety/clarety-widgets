import { getSetting } from 'shared/selectors';
import { getIsBusy } from 'donate/selectors';

export class FundraisingConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      errors: state.errors,
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {};
}
