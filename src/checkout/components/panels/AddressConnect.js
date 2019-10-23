import { statuses, invalidatePanel } from 'shared/actions';
import { setFormData } from 'form/actions';
import { createOrUpdateCustomer } from 'checkout/actions';

export class AddressConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      customer: state.cart.customer,
      errors: state.errors,
    };
  };
  
  static actions = {
    setFormData: setFormData,
    createOrUpdateCustomer: createOrUpdateCustomer,
    invalidatePanel: invalidatePanel,
  };
}
