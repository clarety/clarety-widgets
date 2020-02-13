export class PaymentConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: state.status === 'busy',
      errors: state.errors,
      paymentMethod: { type: 'na' },
    };
  };

  static actions = {
      onShowPanel: () => async () => true,
      onSubmit: () => async () => false,
  };
}
