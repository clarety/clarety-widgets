import { setDetails, setAdditionalData, setErrors, resetDetails } from 'registration/actions';
import { getEvent, getExtendFields, getParticipant, getPartcipantOffer, getIsPrefilled } from 'registration/selectors';

export class DetailsConnect {
  static mapStateToProps = (state, ownProps) => {
    const participant = getParticipant(state, ownProps.participantIndex);

    // We can't map state until we have a participant.
    if (!participant) return {};

    const event = getEvent(state);
    const extendFields = getExtendFields(state);
    const isPrefilled = getIsPrefilled(state, ownProps.participantIndex);
    const offer = getPartcipantOffer(state, ownProps.participantIndex);
    const eventDate = new Date(offer.ageCalculationDate || event.startDate);

    return {
      appSettings: state.settings,
      event: event,
      participant: participant,
      extendFields: extendFields,
      isPrefilled: isPrefilled,
      eventDate: eventDate,
      minAge: Number(offer.minAgeOver),
      maxAge: Number(offer.maxAgeUnder),
      registrationErrors: state.cart.errors,
    };
  };

  static actions = {
    setDetails: setDetails,
    setAdditionalData: setAdditionalData,
    setErrors: setErrors,
    resetDetails: resetDetails,
  };
}
