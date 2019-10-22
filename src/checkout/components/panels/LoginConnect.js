import { statuses, login, logout } from 'shared/actions';
import { getIsLoggedIn } from 'shared/selectors';
import { setFormData, resetFormData } from 'form/actions';
import { hasAccount, fetchAuthCustomer } from 'checkout/actions';

export class CheckoutLoginConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      isLoggedIn: getIsLoggedIn(state),
      customer: state.cart.customer,
      errors: state.errors,
    };
  };

  static actions = {
    hasAccount: hasAccount,
    login: login,
    logout: logout,
    fetchAuthCustomer: fetchAuthCustomer,
    createAccount: undefined,

    setFormData: setFormData,
    resetFormData: resetFormData,
  };
}
