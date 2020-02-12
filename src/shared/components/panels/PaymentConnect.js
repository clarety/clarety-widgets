export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      errors: state.errors,
      paymentMethod: 'na'
    };
  };

  static actions = {
      onShowPanel: async () => true,
      makePayment: async () => false,
  };
}
