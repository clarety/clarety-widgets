import { getSelectedAmount } from 'donate/selectors';
import { selectRgUpsell, skipRgUpsell } from 'donate/actions';

export class RgUpsellConnect {
  static mapStateToProps = (state) => {
    return {
      currentAmount: getSelectedAmount(state),
    };
  };

  static actions = {
    selectRgUpsell: selectRgUpsell,
    skipRgUpsell: skipRgUpsell,
  };
}
