import { insertPanels, removePanels } from 'shared/actions';
import { setQtys, resetQtys } from 'registration/actions';
import { getRegistrationTypes, getRegistrationMode, getQtys } from 'registration/selectors';

export class QtysConnect {
  static mapStateToProps = (state) => {
    return {
      registrationMode: getRegistrationMode(state),
      types: getRegistrationTypes(state),
      qtys: getQtys(state),
    };
  };

  static actions = {
    setQtys: setQtys,
    resetQtys: resetQtys,
    insertPanels: insertPanels,
    removePanels: removePanels,
  };
}
