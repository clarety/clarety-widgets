import { statuses, login, logout } from 'shared/actions';
import { getIsLoggedIn } from 'shared/selectors';
import { setFormData, resetFormData } from 'form/actions';
import { hasAccount, fetchAuthCustomer, createAcountAndLogin, resetPassword } from 'registration/actions';

export class RegistrationLoginConnect {
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
    createAccount: createAcountAndLogin,
    resetPassword: resetPassword,
  
    setFormData: setFormData,
    resetFormData: resetFormData,
  };
};
