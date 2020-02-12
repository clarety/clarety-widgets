import { submitPaymentPanel } from 'donate/actions';
import { getIsBusy } from 'donate/selectors';

export class SubmitConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
    };
  };

  static actions = {
    onSubmit: submitPaymentPanel,
  };
}
