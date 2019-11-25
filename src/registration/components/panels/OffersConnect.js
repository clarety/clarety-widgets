import { addItem, removeItemsWithPanel } from 'shared/actions';
import { setFirstNames, resetFirstNames, setOffers, resetOffers, prefillDetails } from 'registration/actions';
import { getParticipants, getOffersForAllParticipants, getPreviousParticipants, getEvent } from 'registration/selectors';

export class OffersConnect {
  static mapStateToProps = (state) => {
    return {
      participants: getParticipants(state),
      offers: getOffersForAllParticipants(state),
      previousParticipants: getPreviousParticipants(state),
      event: getEvent(state),
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
  };
}
