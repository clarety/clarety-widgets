import { connect } from 'react-redux';
import { PaymentPanel } from 'shared/components/panels/PaymentPanel';
import { createRegistration, makePayment } from 'registrations/actions';

const mapStateToProps = (state, ownProps) => {
  return {
    isBusy: state.status === 'busy',
    errors: state.errors,
    paymentMethod: { type: 'gatewaycc' },
  };
};

const actions = {
  onShowPanel: createRegistration,
  makePayment: makePayment,
};

export const RegistrationsPaymentPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(PaymentPanel);
