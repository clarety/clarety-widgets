import { statuses } from 'shared/actions';
import { setFormData } from 'form/actions';
import { getSetting, getTrackingData, getSourceOptions } from 'shared/selectors';

export class CheckoutCustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      customer: state.cart.customer,
      errors: state.errors,

      variant: getSetting(state, 'variant'),
      tracking: getTrackingData(state),

      sourceOptions: getSourceOptions(state),
    };
  };
  
  static actions = {
    setFormData: setFormData,
  };
}
