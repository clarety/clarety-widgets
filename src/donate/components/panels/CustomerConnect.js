import { getSetting } from 'shared/selectors';
import { getIsBusy } from 'donate/selectors';
import { submitCustomerPanel } from 'donate/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      errors: state.errors,
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onSubmit: submitCustomerPanel,
  };
}
