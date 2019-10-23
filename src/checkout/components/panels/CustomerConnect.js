import { statuses } from 'shared/actions';
import { setFormData } from 'form/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      customer: state.cart.customer,
      errors: state.errors,
    };
  };
  
  static actions = {
    setFormData: setFormData,
  };
}
