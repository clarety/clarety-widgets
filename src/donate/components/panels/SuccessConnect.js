import { getSetting } from 'shared/selectors';
import { getCustomer } from 'donate/selectors';

export class SuccessConnect {
  static mapStateToProps = (state) => {
    return {
      customer : getCustomer(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {};
}
