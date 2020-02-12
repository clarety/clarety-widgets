import { addItem, removeItemsWithType } from 'shared/actions';
import { getSetting } from 'shared/selectors';

export class DonationConnect {
  static mapStateToProps = (state) => {
    return {
      priceHandles: getSetting(state, 'priceHandles'),
    };
  };

  static actions = {
    addToCart: addItem,
    removeItemsWithType: removeItemsWithType,
  };
}
