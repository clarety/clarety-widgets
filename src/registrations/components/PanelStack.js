import React from 'react';
import { connect } from 'react-redux';
import { ScrollIntoView, EventPanel, QtysPanel, NamesPanel, DetailsPanel, ReviewPanel } from 'registrations/components';
import { pushPanel, popToPanel, panels, panelStatuses } from 'registrations/actions';
import { OverrideContext } from 'registrations/utils';

class _PanelStack extends React.Component {
  render() {
    return this.props.panels.map(this.renderPanel);
  }

  renderPanel = (panel, index) => {
    const { pushPanel, popToPanel } = this.props;

    const PanelComponent = this.resolvePanelComponent(panel.name);

    return (
      <ScrollIntoView isActive={panel.status === panelStatuses.edit} key={index} className="section">
        <PanelComponent
          index={index}
          panel={panel}
          isDone={panel.status === panelStatuses.done}
          pushPanel={pushPanel}
          popToPanel={() => popToPanel(index)}
        />
      </ScrollIntoView>
    );
  }

  resolvePanelComponent(name) {
    switch (name) {
      case panels.eventPanel:   return this.context.EventPanel   || EventPanel;
      case panels.qtysPanel:    return this.context.QtysPanel    || QtysPanel;
      case panels.namesPanel:   return this.context.NamesPanel   || NamesPanel;
      case panels.detailsPanel: return this.context.DetailsPanel || DetailsPanel;
      case panels.reviewPanel:  return this.context.ReviewPanel  || ReviewPanel;
  
      default: throw new Error(`Cannot resolve panel component ${name}`);
    }
  }
}

_PanelStack.contextType = OverrideContext;

const mapStateToProps = state => {
  return {
    panels: state.panels,
  };
};

const actions = {
  pushPanel: pushPanel,
  popToPanel: popToPanel,
};

export const PanelStack = connect(mapStateToProps, actions)(_PanelStack);
