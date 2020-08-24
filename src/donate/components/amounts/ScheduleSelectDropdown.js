import React from 'react';
import { Dropdown } from 'react-bootstrap';

export const ScheduleSelectDropdown = ({ value, placeholder, schedules, onChange }) => (
  <Dropdown>
    <Dropdown.Toggle>
      {getLabel(schedules, value) || placeholder || 'Select'}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {schedules.map(schedule =>
        <Dropdown.Item
          key={schedule.offerPaymentUid}
          onClick={() => onChange(schedule.offerPaymentUid)}
        >
          {schedule.label}
        </Dropdown.Item>
      )}
    </Dropdown.Menu>
  </Dropdown>
);

function getLabel(schedules, value) {
  if (!value) return undefined;

  const schedule = schedules.find(schedule => schedule.offerPaymentUid === value);
  return schedule ? schedule.label : undefined;
}
