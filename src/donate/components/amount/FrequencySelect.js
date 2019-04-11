import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

const FrequencySelect = ({ options, value, onChange }) => (
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

export default FrequencySelect;
