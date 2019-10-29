import { checkTeamPassword, selectTeam, createTeam } from 'registration/actions';

export class TeamConnect {
  static mapStateToProps = (state) => {
    const { teamPanel } = state.panels;
    const { selectedTeam, isBusyPassword, isBusyCreate } = teamPanel;

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
