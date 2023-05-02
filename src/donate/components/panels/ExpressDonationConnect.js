import { getIsBusy, getHasExpressPaymentMethods } from 'donate/selectors';

export class ExpressDonationConnect {
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

/**
 * @deprecated
 * Use "ExpressDonationConnect" instead, this is just an alias for backwards compatibility.
 * The name "ExpressCheckoutConnect" is misleading, as it's only for donations.
 */
export const ExpressCheckoutConnect = ExpressDonationConnect;
