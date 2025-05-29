import { statuses } from 'shared/actions';
import { setFormData } from 'form/actions';
import { getSetting, getTrackingData, getSourceOptions, getCustomerSubTypeOptions } from 'shared/selectors';

export class CheckoutCustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      customer: state.cart.customer,
      errors: state.errors,

      variant: getSetting(state, 'variant'),
      tracking: getTrackingData(state),

      sourceOptions: getSourceOptions(state),
      customerSubTypeOptions: getCustomerSubTypeOptions(state),
      defaultCountry: getSetting(state, 'defaultCountry'),
    };
  };
  
  static actions = {
    setFormData: setFormData,
  };
}
