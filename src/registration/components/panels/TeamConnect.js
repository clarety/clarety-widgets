import { setTeamPanelMode, checkTeamPassword, selectTeam, createTeam } from 'registration/actions';

export class TeamConnect {
  static mapStateToProps = (state) => {
    const { teamPanel } = state.panels;
    const { mode, selectedTeam, isBusyPassword, isBusyCreate } = teamPanel;

    const canContinue = selectedTeam && !selectedTeam.passwordRequired;
    const requiresPassword = selectedTeam && !!selectedTeam.passwordRequired;

    return {
      mode: mode,
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
    setPanelMode: setTeamPanelMode,
    checkTeamPassword: checkTeamPassword,
    selectTeam: selectTeam,
    createTeam: createTeam,
  };
}
