import { getSelectedDonations } from 'update-payment-details/selectors';

export class SuccessConnect {
  static mapStateToProps = (state) => {
    return {
      selectedDonations: getSelectedDonations(state),
    };
  };

  static actions = {};
}
