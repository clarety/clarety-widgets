import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

export const ScheduleSelectButtonGroup = ({ value, schedules, onChange }) => (
  <ToggleButtonGroup
    type="radio"
    name="schedule"
    value={value || ''}
    onChange={onChange}
  >
    {schedules.map(option => (
      <ToggleButton
        key={option.offerPaymentUid}
        value={option.offerPaymentUid}
        variant="outline-secondary"
      >
        {option.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);
