import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { t } from 'shared/translations';

export const SosProgress = ({ sos }) => (
  <div className="sos-progress">
    <p>
      {t('sos-signatures', '{{count}} have already signed...', { count: sos.current })}
      {' '}
      <span className="goal-text">{t('sos-goal', "Let's get to {{goal}}!", { goal: sos.goal })}</span>
    </p>

    <ProgressBar now={sos.current/sos.goal * 100} />
  </div>
);
