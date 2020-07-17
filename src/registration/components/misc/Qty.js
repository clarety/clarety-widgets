import React from 'react';
import { t } from 'shared/translations';

export const Qty = ({ type, qty }) => {
  if (!qty) return null;

  if (type === 'adult') return <div>{qty} &times; {t('label.adult', 'Adults',   { count: qty })}</div>
  if (type === 'child') return <div>{qty} &times; {t('label.child', 'Children', { count: qty })}</div>

  return null;
};
