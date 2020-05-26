import { statuses } from 'shared/actions';
import { setFormData } from 'form/actions';
import { getSetting, getTrackingData, getSourceOptions, getSourceQuestions } from 'shared/selectors';

export class CheckoutCustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      customer: state.cart.customer,
      errors: state.errors,

      variant: getSetting(state, 'variant'),
      tracking: getTrackingData(state),

      defaultCountry: getSetting(state, 'defaultCountry') || 'AU',

      sourceOptions: getSourceOptions(state),
      sourceQuestions: getSourceQuestions(state),
    };
  };
  
  static actions = {
    setFormData: setFormData,
  };
}
