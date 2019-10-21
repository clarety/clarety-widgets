import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { searchTeams, selectTeam } from 'registration/actions';

export class _TeamSeachInput extends React.Component {
  timout = null;

  onQueryChange = (query, { action }) => {
    if (action !== 'input-change') return;

    // Perform search after timeout.
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.props.searchTeams(query), 500);
  };

  onSelectTeam = team => {
    this.props.selectTeam(team);
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
  const { teamPanel } = state.panels;

  return {
    isBusySearch: teamPanel.isBusySearch,
    searchResults: teamPanel.searchResults,
    selectedTeam: teamPanel.selectedTeam,
  };
};

const actions = {
  searchTeams: searchTeams,
  selectTeam: selectTeam,
};

export const connectTeamSearchInput = connect(mapStateToProps, actions);
export const TeamSearchInput = connectTeamSearchInput(_TeamSeachInput);