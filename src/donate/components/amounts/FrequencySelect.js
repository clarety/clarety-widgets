import React from 'react';
import { connect } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { getSetting } from 'shared/selectors';
import { selectFrequency, selectDefaultECard } from 'donate/actions';

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

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (frequency) => {
      dispatch(selectFrequency(frequency));

      // changing frequency changes the selected offer, and each offer has separate e-card options.
      dispatch(selectDefaultECard());
    },
  }
}

export const FrequencySelect = connect(mapStateToProps, mapDispatchToProps)(_FrequencySelect);
