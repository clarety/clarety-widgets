import { getSetting } from 'shared/selectors';
import { getCustomer, getSuccessfulDonation } from 'donate/selectors';

export class SuccessConnect {
  static mapStateToProps = (state) => {
    return {
      customer : getCustomer(state),
      donation: getSuccessfulDonation(state),
      forceMd: getSetting(state, 'forceMdLayout'),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {};
}
