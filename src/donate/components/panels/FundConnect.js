import { getSetting } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, setFormData } from 'form/actions';
import { getIsBusy, getFunds, getFundOptions, getDefaultFundId, getSelectedFund } from 'donate/selectors';
import { fetchFundOffers } from 'donate/actions';

export class FundConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      funds: getFunds(state),
      fundOptions: getFundOptions(state),
      defaultFundId: getDefaultFundId(state),
      selectedFund: getSelectedFund(state),
    };
  };

  static actions = {
    onSubmit: fetchFundOffers,
    setFormData: setFormData,
    setErrors: setErrors,
  };
}
