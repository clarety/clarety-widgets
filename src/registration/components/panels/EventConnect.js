import { fetchFullEvent, checkPromoCode } from 'registration/actions';
import { getEvents, getEvent, getTeams, getStateOptions } from 'registration/selectors';

export class EventConnect {
  static mapStateToProps = (state) => {
    const teams = getTeams(state);

    return {
      isBusy: state.settings.isBusy || teams.isBusyPromoCode,
      events: getEvents(state),
      stateOptions: getStateOptions(state),
      selectedEvent: getEvent(state),
      formData: state.formData,
    };
  };

  static actions = {
    fetchFullEvent: fetchFullEvent,
    checkPromoCode: checkPromoCode,
  };
}
