import { getIsBusy, getHasExpressPaymentMethods } from 'donate/selectors';

export class ExpressCheckoutConnect {
  static mapStateToProps = (state, ownProps) => {
    return {
      isBusy: getIsBusy(state),
      hasExpressPaymentMethods: getHasExpressPaymentMethods(state),
    };
  };

  static actions = {
    onShowPanel: () => async () => true,
    onSubmit: () => async () => true,
  };
}
