import { statuses } from 'shared/actions';
import { setFormData } from 'form/actions';
import { updateSale, fetchShippingOptions } from 'checkout/actions';
import { hasSelectedShippingOption, getSelectedShippingOptionLabel } from 'checkout/selectors';

export class ShippingConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.status === statuses.busy,
      canContinue: hasSelectedShippingOption(state),
      selectedOptionUid: state.formData['sale.shippingUid'],
      shippingOptions: state.cart.shippingOptions,
      selectedOptionName: getSelectedShippingOptionLabel(state),
    };
  };

  static actions = {
    fetchShippingOptions: fetchShippingOptions,
    setFormData: setFormData,
    updateSale: updateSale,
  };
}
