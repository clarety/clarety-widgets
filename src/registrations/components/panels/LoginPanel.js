import { connect } from 'react-redux';
import { LoginPanel } from 'shared/components/panels/LoginPanel';
import { statuses, login, logout } from 'shared/actions';
import { getIsLoggedIn } from 'shared/selectors';
import { setFormData, resetFormData } from 'form/actions';
import { hasAccount } from 'checkout/actions';
import { fetchAuthCustomer, createAcountAndLogin } from 'registrations/actions';

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busy,
    isLoggedIn: getIsLoggedIn(state),
    customer: state.cart.customer,
    errors: state.errors,
  };
};

const actions = {
  hasAccount: hasAccount,
  login: login,
  logout: logout,
  fetchAuthCustomer: fetchAuthCustomer,
  createAccount: createAcountAndLogin,

  setFormData: setFormData,
  resetFormData: resetFormData,
};

export const RegistrationsLoginPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(LoginPanel);
