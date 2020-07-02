import { statuses, invalidatePanel } from 'shared/actions';
import { getCartShippingRequired, getSetting } from 'shared/selectors';
import { setFormData } from 'form/actions';
import { createOrUpdateCustomer } from 'checkout/actions';

export class AddressConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      customer: state.cart.customer,
      errors: state.errors,
      defaultCountry: getSetting(state, 'defaultCountry'),
      shippingRequired: getCartShippingRequired(state)
    };
  };
  
  static actions = {
    setFormData: setFormData,
    createOrUpdateCustomer: createOrUpdateCustomer,
    invalidatePanel: invalidatePanel
  };
}
