import { addItem } from 'shared/actions';
import { getVariant, getSetting } from 'shared/selectors';
import { setDetails, setAdditionalData, setErrors, resetDetails, setWaveInCart, addAddOnToCart, removeAddOnsFromCart } from 'registration/actions';
import { getEvent, getExtendFields, getParticipant, getWaveOptions, getAddOns, getParticipantOffer, getIsPrefilled, getIsCorporateTeam } from 'registration/selectors';

export class DetailsConnect {
  static mapStateToProps = (state, ownProps) => {
    const participant = getParticipant(state, ownProps.participantIndex);
    const firstParticipant = getParticipant(state, 0);

    // We can't map state until we have a participant.
    if (!participant) return {};
    
    const event = getEvent(state);
    const offer = getParticipantOffer(state, ownProps.participantIndex);
    const eventDate = new Date(offer.ageCalculationDate || event.startDate);

    const extendFields = getExtendFields(state);
    const waveOptions = getWaveOptions(state, ownProps.participantIndex);
    const addOns = getAddOns(state, ownProps.participantIndex);

    const variant = getVariant(state);
    const storeId = getSetting(state, 'storeId');

    const isPrefilled = getIsPrefilled(state, ownProps.participantIndex);
    const isCorporateTeam = getIsCorporateTeam(state, ownProps.participantIndex);

    return {
      participant: participant,
      firstParticipant: firstParticipant,

      extendFields: extendFields,
      waveOptions: waveOptions,
      addOns: addOns,

      event: event,
      eventDate: eventDate,
      minAge: offer.minAgeOver,
      maxAge: offer.maxAgeUnder,

      appSettings: state.settings,
      variant: variant,
      storeId: storeId,

      isPrefilled: isPrefilled,
      isCorporateTeam: isCorporateTeam,

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
