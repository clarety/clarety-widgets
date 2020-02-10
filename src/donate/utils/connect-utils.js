import { connect } from 'react-redux';
import { getSetting } from 'shared/selectors';
import { getIsBusy } from 'donate/selectors';

export function connectFundraisingPanel(ViewComponent) {
  const mapStateToProps = state => {
    return {
      isBusy: getIsBusy(state),
      errors: state.errors,
      forceMd: getSetting(state, 'forceMdLayout'),
      variant: getSetting(state, 'variant'),
    };
  };
  
  const actions = {
  };
  
  return connect(mapStateToProps, actions)(ViewComponent);
}
