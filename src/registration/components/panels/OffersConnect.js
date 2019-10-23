import { setFirstNames, resetFirstNames, setOffers, resetOffers, prefillDetails } from 'registration/actions';
import { getParticipants, getOffersForAllParticipants, getPreviousParticipants } from 'registration/selectors';

export class OffersConnect {
  static mapStateToProps = (state) => {
    return {
      participants: getParticipants(state),
      offers: getOffersForAllParticipants(state),
      previousParticipants: getPreviousParticipants(state),
    };
  };

  static actions = {
    setFirstNames: setFirstNames,
    resetFirstNames: resetFirstNames,
    prefillDetails: prefillDetails,
    setOffers: setOffers,
    resetOffers: resetOffers,
  };
}
