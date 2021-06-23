import { getSetting } from 'shared/selectors';
import { fetchPriceHandles, addDonation, removeDonation } from 'checkout/actions';
import { getDonationInCart } from 'checkout/selectors';

export class DonationConnect {
  static mapStateToProps = (state) => {
    return {
      priceHandles: getSetting(state, 'priceHandles'),
      donationInCart: getDonationInCart(state),
      donationOfferUid: getSetting(state, 'donationOfferUid'),
    };
  };

  static actions = {
    onShowPanel: fetchPriceHandles,
    addToCart: addDonation,
    removeItemsWithType: removeDonation,
  };
}
