import React from 'react';
import { connect } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import * as donateActions from '../../actions';

const FrequencySelect = ({ value, options, onChange }) => (
  <ToggleButtonGroup
    type="radio"
    name="frequency"
    value={value}
    onChange={onChange}
  >
    {options.map(option => (
      <ToggleButton
        value={option.value}
        key={option.value}
        variant="outline-primary"
        data-testid={option.value}
      >
        {option.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

const mapStateToProps = state => {
  return {
    value: state.panels.amountPanel.frequency,
    options: state.explain.offers.map(offer => ({
      value: offer.frequency,
      label: offer.label,
    })),
  }
};

const actions = {
  onChange: donateActions.selectFrequency,
};

export default connect(mapStateToProps, actions)(FrequencySelect);
