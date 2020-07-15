import { fetchFullEvent, checkPromoCode } from 'registration/actions';
import { getEvents, getEvent, getStateOptions } from 'registration/selectors';

export class EventConnect {
  static mapStateToProps = (state) => {
    return {
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
