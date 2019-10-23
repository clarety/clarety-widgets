import { clearItems } from 'shared/actions';
import { selectAmount, submitAmountPanel } from 'donate/actions';
import { getSelectedAmount } from 'donate/selectors';

export class DonateConnect {
  static mapStateToProps = (state) => {
    const { amountPanel } = state.panels;

    return {
      offers: state.settings.priceHandles,
      frequency: amountPanel.frequency,
      selections: amountPanel.selections,
      selectedAmount: getSelectedAmount(state),
      errors: state.cart.errors,
    };
  };

  static actions = {
    selectAmount: selectAmount,
    submitAmountPanel: submitAmountPanel,
    clearItems: clearItems,
  };
}
