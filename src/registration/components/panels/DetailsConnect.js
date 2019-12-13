import { addItem } from 'shared/actions';
import { getVariant } from 'shared/selectors';
import { setDetails, setAdditionalData, setErrors, resetDetails, setWaveInCart, addAddOnToCart, removeAddOnsFromCart } from 'registration/actions';
import { getEvent, getExtendFields, getParticipant, getWaveOptions, getAddOns, getParticipantOffer, getIsPrefilled, getIsCorporateTeam } from 'registration/selectors';

export class DetailsConnect {
  static mapStateToProps = (state, ownProps) => {
    const participant = getParticipant(state, ownProps.participantIndex);
    const firstParticipant = getParticipant(state, 0);

    // We can't map state until we have a participant.
    if (!participant) return {};

    const variant = getVariant(state);
    const event = getEvent(state);
    const extendFields = getExtendFields(state);
    const waveOptions = getWaveOptions(state, ownProps.participantIndex);
    const addOns = getAddOns(state, ownProps.participantIndex);
    const isPrefilled = getIsPrefilled(state, ownProps.participantIndex);
    const isCorporateTeam = getIsCorporateTeam(state, ownProps.participantIndex);
    const offer = getParticipantOffer(state, ownProps.participantIndex);
    const eventDate = new Date(offer.ageCalculationDate || event.startDate);

    return {
      variant: variant,
      appSettings: state.settings,
      event: event,
      participant: participant,
      firstParticipant: firstParticipant,
      extendFields: extendFields,
      waveOptions: waveOptions,
      addOns: addOns,
      isPrefilled: isPrefilled,
      isCorporateTeam: isCorporateTeam,
      eventDate: eventDate,
      minAge: offer.minAgeOver,
      maxAge: offer.maxAgeUnder,
      registrationErrors: state.cart.errors,
    };
  };

  static actions = {
    setDetails: setDetails,
    setAdditionalData: setAdditionalData,
    addToCart: addItem,
    setWaveInCart: setWaveInCart,
    addAddOnToCart: addAddOnToCart,
    removeAddOnsFromCart: removeAddOnsFromCart,
    setErrors: setErrors,
    resetDetails: resetDetails,
  };
}
