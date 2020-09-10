import { addItem, removeItemsWithPanel } from 'shared/actions';
import { getVariant } from 'shared/selectors';
import { setFirstNames, resetFirstNames, setOffers, resetOffers, prefillDetails, checkPromoCode } from 'registration/actions';
import { getParticipants, getOffersForAllParticipants, getPreviousParticipants, getEvent } from 'registration/selectors';

export class OffersConnect {
  static mapStateToProps = (state) => {
    return {
      participants: getParticipants(state),
      offers: getOffersForAllParticipants(state),
      previousParticipants: getPreviousParticipants(state),
      event: getEvent(state),
      variant: getVariant(state),
      formData: state.formData,
    };
  };

  static actions = {
    setFirstNames: setFirstNames,
    resetFirstNames: resetFirstNames,
    prefillDetails: prefillDetails,
    setOffers: setOffers,
    resetOffers: resetOffers,
    addToCart: addItem,
    removeItemsWithPanel: removeItemsWithPanel,
    checkPromoCode: checkPromoCode,
  };
}
