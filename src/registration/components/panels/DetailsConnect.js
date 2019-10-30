import { setDetails, setAdditionalData, updateAddOn, setErrors, resetDetails, setParticipantWave } from 'registration/actions';
import { getEvent, getExtendFields, getParticipant, getWaveOptions, getAddOns, getParticipantOffer, getIsPrefilled } from 'registration/selectors';

export class DetailsConnect {
  static mapStateToProps = (state, ownProps) => {
    const participant = getParticipant(state, ownProps.participantIndex);

    // We can't map state until we have a participant.
    if (!participant) return {};

    const event = getEvent(state);
    const extendFields = getExtendFields(state);
    const waveOptions = getWaveOptions(state, ownProps.participantIndex);
    const addOns = getAddOns(state, ownProps.participantIndex);
    const isPrefilled = getIsPrefilled(state, ownProps.participantIndex);
    const offer = getParticipantOffer(state, ownProps.participantIndex);
    const eventDate = new Date(offer.ageCalculationDate || event.startDate);

    return {
      appSettings: state.settings,
      event: event,
      participant: participant,
      extendFields: extendFields,
      waveOptions: waveOptions,
      addOns: addOns,
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
    setParticipantWave: setParticipantWave,
    updateAddOn: updateAddOn,
    setErrors: setErrors,
    resetDetails: resetDetails,
  };
}
