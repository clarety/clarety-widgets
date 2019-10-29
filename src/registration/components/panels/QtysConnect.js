import { insertPanels, removePanels } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { setQtys, resetQtys } from 'registration/actions';
import { getRegistrationTypes, getQtys } from 'registration/selectors';

export class QtysConnect {
  static mapStateToProps = (state) => {
    return {
      registrationMode: getSetting(state, 'registrationMode'),
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
