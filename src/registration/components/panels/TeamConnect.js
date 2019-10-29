import { setOrganisation } from 'shared/actions';
import { getOrganisation } from 'shared/selectors';
import { checkTeamPassword, createTeam } from 'registration/actions';
import { getTeams } from 'registration/selectors';

export class TeamConnect {
  static mapStateToProps = (state) => {
    const { isBusyPassword, isBusyCreate } = getTeams(state);
    const selectedTeam = getOrganisation(state);
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
    setOrganisation: setOrganisation,
    checkTeamPassword: checkTeamPassword,
    createTeam: createTeam,
  };
}
