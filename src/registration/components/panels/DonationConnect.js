import { getSetting } from 'shared/selectors';

export class DonationConnect {
  static mapStateToProps = (state) => {
    return {
      priceHandles: getSetting(state, 'priceHandles'),
    };
  };

  static actions = {};
}
