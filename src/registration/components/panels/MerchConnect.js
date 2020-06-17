import { removeItemsWithType, updateCustomer } from 'shared/actions';
import { addMerchToCart } from 'registration/actions';
import { getEventMerchandise } from 'registration/selectors';

export class MerchConnect {
  static mapStateToProps = (state) => {
    return {
      merchandise: getEventMerchandise(state),
    };
  };

  static actions = { addMerchToCart, updateCustomer, removeItemsWithType };
}
