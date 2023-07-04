import React from 'react';
import { connect } from 'react-redux';
import { getSetting, getPanelManager } from 'shared/selectors';

const _StepIndicator = ({ panels }) => {
  return (
    <ol className="widget-step-indicator">
      {panels.length > 1 && panels.map(panel => (
        <li key={panel.id} className={getClassName(panel.status)}>
          <span>{panel.name}</span>
        </li>
      ))}
    </ol>
  );
};

const mapStateToProps = (state) => {
  const panelSettings = getSetting(state, 'panels');
  const panelManager = getPanelManager(state);

  // Remove any panels with 'hideTab' setting.
  const panels = panelManager.filter(panel => {
    const settings = panelSettings[panel.component];
    return settings && !settings.hideTab;
  });

  return {
    panels: panels.map(panel => ({
      id: panel.id,
      name: panelSettings[panel.component].tabName,
      status: panel.status,
    })),
  };
};

export const StepIndicator = connect(mapStateToProps)(_StepIndicator);

function getClassName(status) {
  if (status === 'wait') return '';
  if (status === 'edit') return 'current';
  if (status === 'done') return 'visited';

  return null;
}
