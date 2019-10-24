import React from 'react';
import { connect } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { getSetting } from 'shared/selectors';
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
  const priceHandles = getSetting(state, 'priceHandles');

  return {
    value: state.panels.amountPanel.frequency,
    options: priceHandles.map(offer => ({
      value: offer.frequency,
      label: offer.frequency === 'single' ? 'Single Gift' : 'Monthly Gift',
    })),
  }
};

const actions = {
  onChange: selectFrequency,
};

export const FrequencySelect = connect(mapStateToProps, actions)(_FrequencySelect);
