import { setEvent, resetEvent, fetchFullEvent } from 'registration/actions';
import { getEvent } from 'registration/selectors';

export class EventConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: state.settings.isBusy,
      events: state.settings.events,
      selectedEvent: getEvent(state),
    };
  };

  static actions = {
    fetchFullEvent: fetchFullEvent,
  };
}
