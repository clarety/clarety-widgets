import { updateAppSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';

export class ModeConnect {
  static mapStateToProps = (state) => {
    return {
      selectedMode: getSetting(state, 'registrationMode'),
    };
  };
  
  static actions = {
    updateAppSettings: updateAppSettings,
  };
}
