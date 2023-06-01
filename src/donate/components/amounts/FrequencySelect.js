import React from 'react';
import { connect } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { getSetting } from 'shared/selectors';
import { selectFrequency } from 'donate/actions';

export const _FrequencySelect = ({ value, options, onChange }) => (
  <div className="frequency-select">
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
          variant="outline-secondary"
          data-testid={option.value}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </div>
);

export const mapStateToProps = (state, ownProps) => {
  const priceHandles = getSetting(state, 'priceHandles');

  return {
    value: state.panels.donationPanel.frequency,
    options: priceHandles.map(offer => ({
      value: offer.frequency,
      label: offer.frequency === 'single' ? ownProps.singleLabel : ownProps.recurringLabel,
    })),
  }
};

export const actions = {
  onChange: selectFrequency,
};

export const FrequencySelect = connect(mapStateToProps, actions)(_FrequencySelect);
