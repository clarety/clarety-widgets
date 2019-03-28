import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

const FrequencySelect = ({ value, onChange }) => (
  <ToggleButtonGroup
    type="radio"
    name="frequency"
    value={value}
    onChange={onChange}
  >
    <ToggleButton value="single" variant="outline-primary">One-Time</ToggleButton>
    <ToggleButton value="recurring" variant="outline-primary">Monthly</ToggleButton>
  </ToggleButtonGroup>
);

export default FrequencySelect;
