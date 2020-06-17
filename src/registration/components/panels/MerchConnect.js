import { removeItemsWithType, updateCustomer } from 'shared/actions';
import { getCart } from 'shared/selectors';
import { addMerchToCart } from 'registration/actions';
import { getEventMerchandise } from 'registration/selectors';

export class MerchConnect {
  static mapStateToProps = (state) => {
    return {
      merchandise: getEventMerchandise(state),
      customer: getCart(state).customer,
    };
  };

  static actions = { addMerchToCart, updateCustomer, removeItemsWithType };
}
