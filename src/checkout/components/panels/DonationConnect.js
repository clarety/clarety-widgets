import { getSetting } from 'shared/selectors';
import { fetchPriceHandles, addDonation, removeDonation } from 'checkout/actions';

export class DonationConnect {
  static mapStateToProps = (state) => {
    return {
      priceHandles: getSetting(state, 'priceHandles'),
    };
  };

  static actions = {
    onShowPanel: fetchPriceHandles,
    addToCart: addDonation,
    removeItemsWithType: removeDonation,
  };
}
