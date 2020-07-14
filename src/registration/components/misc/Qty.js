import React from 'react';
import { t } from 'shared/translations';

export const Qty = ({ type, qty }) => {
  if (!qty) return null;

  if (type === 'child') return <div>{qty} {t('label.child', 'children', { count: qty })}</div>
  if (type === 'adult') return <div>{qty} {t('label.adult', 'adults',   { count: qty })}</div>

  return null;
};
