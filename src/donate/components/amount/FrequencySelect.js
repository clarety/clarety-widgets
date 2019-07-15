import React from 'react';
import { connect } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { selectFrequency } from 'donate/actions';

const _FrequencySelect = ({ value, options, onChange }) => (
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
        variant="outline-info"
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
  onChange: selectFrequency,
};

export const FrequencySelect = connect(mapStateToProps, actions)(_FrequencySelect);
