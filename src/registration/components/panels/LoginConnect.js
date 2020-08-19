import { statuses, login, logout } from 'shared/actions';
import { getIsLoggedIn } from 'shared/selectors';
import { setFormData, resetFormData } from 'form/actions';
import { hasAccount, fetchAuthCustomer, createAcountAndLogin, createGuestAccount, resetPassword } from 'registration/actions';

export class LoginConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      isBusyResetPassword: state.status === 'busy-reset-password',
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
    createGuestAccount: createGuestAccount,
    resetPassword: resetPassword,
  
    setFormData: setFormData,
    resetFormData: resetFormData,
  };
};

// Also export as 'RegistrationLoginConnect' for backwards compatibility.
export const RegistrationLoginConnect = LoginConnect;
