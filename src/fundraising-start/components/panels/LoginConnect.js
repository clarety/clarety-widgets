import { statuses, login, logout } from 'shared/actions';
import { getIsLoggedIn } from 'shared/selectors';
import { setFormData, resetFormData } from 'form/actions';
import { hasAccount, fetchAuthCustomer, createAcountAndLogin, resetPassword } from 'registration/actions';
import { createCampaign } from 'fundraising-start/actions';

export class FundraisingStartLoginConnect {
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
    resetPassword: resetPassword,

    setFormData: setFormData,
    resetFormData: resetFormData,
    
    nextPanel: createCampaign,
  };
}
