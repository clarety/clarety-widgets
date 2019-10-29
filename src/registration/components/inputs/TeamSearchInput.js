import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { setOrganisation } from 'shared/actions';
import { getOrganisation } from 'shared/selectors';
import { searchTeams } from 'registration/actions';
import { getTeams } from 'registration/selectors';

export class _TeamSeachInput extends React.Component {
  timout = null;

  onQueryChange = (query, { action }) => {
    if (action !== 'input-change') return;

    // Perform search after timeout.
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.props.searchTeams(query), 500);
  };

  onSelectTeam = team => {
    this.props.setOrganisation(team);
  };

  render() {
    const { isBusySearch, searchResults, selectedTeam, placeholder } = this.props;

    return (
      <Select
        value={selectedTeam}
        options={searchResults}
        onChange={this.onSelectTeam}
        onInputChange={this.onQueryChange}
        placeholder={placeholder}
        isLoading={isBusySearch}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.teamId}
        classNamePrefix="react-select"
      />
    );
  }
}

const mapStateToProps = state => {
  const { isBusySearch, searchResults } = getTeams(state);
  const selectedTeam = getOrganisation(state);

  return {
    isBusySearch: isBusySearch,
    searchResults: searchResults,
    selectedTeam: selectedTeam,
  };
};

const actions = {
  searchTeams: searchTeams,
  setOrganisation: setOrganisation,
};

export const connectTeamSearchInput = connect(mapStateToProps, actions);
export const TeamSearchInput = connectTeamSearchInput(_TeamSeachInput);
