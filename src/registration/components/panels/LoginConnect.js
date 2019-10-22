import { statuses, login, logout } from 'shared/actions';
import { getIsLoggedIn } from 'shared/selectors';
import { setFormData, resetFormData } from 'form/actions';
import { hasAccount } from 'checkout/actions';
import { fetchAuthCustomer, createAcountAndLogin } from 'registration/actions';

export const RegistrationLoginConnect = {
  mapStateToProps: (state) => {
    return {
      isBusy: state.status === statuses.busy,
      isLoggedIn: getIsLoggedIn(state),
      customer: state.cart.customer,
      errors: state.errors,
    };
  },
  
  actions: {
    hasAccount: hasAccount,
    login: login,
    logout: logout,
    fetchAuthCustomer: fetchAuthCustomer,
    createAccount: createAcountAndLogin,
  
    setFormData: setFormData,
    resetFormData: resetFormData,
  },
};
