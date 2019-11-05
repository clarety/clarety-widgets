import { fetchFullEvent, checkPromoCode } from 'registration/actions';
import { getEvent, getTeams } from 'registration/selectors';

export class EventConnect {
  static mapStateToProps = (state) => {
    const teams = getTeams(state);

    return {
      isBusy: state.settings.isBusy || teams.isBusyPromoCode,
      events: state.settings.events,
      selectedEvent: getEvent(state),
      formData: state.formData,
    };
  };

  static actions = {
    fetchFullEvent: fetchFullEvent,
    checkPromoCode: checkPromoCode,
  };
}
