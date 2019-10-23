import { setRegistrationMode } from 'registration/actions';
import { getRegistrationMode } from 'registration/selectors';

export class ModeConnect {
  static mapStateToProps = (state) => {
    return {
      selectedMode: getRegistrationMode(state),
    };
  };
  
  static actions = {
    setRegistrationMode,
  };
}
