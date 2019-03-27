import React from 'react';
import { Button } from 'react-bootstrap';

const SelectButton = ({ title, isSelected, onClick }) => (
  <Button variant={isSelected ? 'primary' : 'link'} onClick={onClick} style={{ margin: '0 5px' }}>{title}</Button>
);

export default SelectButton;
