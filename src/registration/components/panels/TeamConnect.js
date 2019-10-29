import { checkTeamPassword, selectTeam, createTeam } from 'registration/actions';
import { getTeams } from 'registration/selectors';

export class TeamConnect {
  static mapStateToProps = (state) => {
    const { selectedTeam, isBusyPassword, isBusyCreate } = getTeams(state);

    const canContinue = selectedTeam && !selectedTeam.passwordRequired;
    const requiresPassword = selectedTeam && !!selectedTeam.passwordRequired;

    return {
      selectedTeam: selectedTeam,
      canContinue: canContinue,
      requiresPassword: requiresPassword,
      isBusyPassword: isBusyPassword,
      isBusyCreate: isBusyCreate,
      formData: state.formData,
      errors: state.errors,
    };
  };

  static actions = {
    checkTeamPassword: checkTeamPassword,
    selectTeam: selectTeam,
    createTeam: createTeam,
  };
}
