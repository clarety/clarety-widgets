import React from 'react';
import { connect } from 'react-redux';
import { panels, pushPanel, popToPanel, setPanelStatus, resetAllPanels } from 'shared/actions';
import { OverrideContext } from 'shared/utils';
import { LoginPanel, PersonalDetailsPanel, ShippingDetailsPanel, ShippingOptionsPanel, PaymentDetailsPanel } from 'checkout/components';
import { ScrollIntoView, EventPanel, QtysPanel, NamesPanel, DetailsPanel, TeamPanel, DonatePanel, ReviewPanel } from 'registrations/components';

class _PanelManager extends React.Component {
  constructor(props) {
    super(props);

    this.panelRefs = props.panels.map(panel => React.createRef());
  }

  nextPanel = current => {
    this.setStatus(current, 'done');

    const next = this.getFirstIndexWithStatus('wait');
    if (next !== -1) this.setStatus(next, 'edit');
  };

  editPanel = next => {
    const current = this.getFirstIndexWithStatus('edit');
    if (current !== -1) this.setStatus(current, 'wait');

    this.setStatus(next, 'edit');
  };

  pushPanel = panel => {
    this.props.pushPanel(panel);
  };

  popToPanel = index => {
    this.props.popToPanel(index);
  };

  resetAllPanels = () => {
    this.props.resetAllPanels();
  };

  resetPanelData = () => {
    for (let panelRef of this.panelRefs) {
      panelRef.current.resetPanelData();
    }
  };

  render() {
    return this.props.panels.map(this.renderPanel);
  }

  renderPanel = (panel, index) => {
    const { panels, layout } = this.props;
    const PanelComponent = this.resolvePanelComponent(panel.name);
    
    const status = panel.status || (panels.length - 1 === index ? 'edit' : 'done');
    const shouldScroll = layout === 'stack' && status === 'edit';
    const className = layout === 'stack' ? 'section' : undefined;

    return (
      <ScrollIntoView isActive={shouldScroll} key={index} className={className}>
        <PanelComponent
          key={index}
          index={index}
          ref={this.panelRefs[index]}

          status={status}

          nextPanel={() => this.nextPanel(index)}
          editPanel={() => this.editPanel(index)}
          pushPanel={panel => this.pushPanel(panel)}
          popToPanel={() => this.popToPanel(index)}

          resetAllPanels={this.resetAllPanels}
          resetPanelData={this.resetPanelData}

          {...panel.props}
        />
      </ScrollIntoView>
    );
  };

  resolvePanelComponent(name) {
    switch (name) {
      case panels.eventPanel:   return this.context.EventPanel   || EventPanel;
      case panels.qtysPanel:    return this.context.QtysPanel    || QtysPanel;
      case panels.namesPanel:   return this.context.NamesPanel   || NamesPanel;
      case panels.detailsPanel: return this.context.DetailsPanel || DetailsPanel;
      case panels.teamPanel:    return this.context.TeamPanel    || TeamPanel;
      case panels.donatePanel:  return this.context.DonatePanel  || DonatePanel;
      case panels.reviewPanel:  return this.context.ReviewPanel  || ReviewPanel;

      case panels.loginPanel:           return this.context.LoginPanel           || LoginPanel;
      case panels.personalDetailsPanel: return this.context.PersonalDetailsPanel || PersonalDetailsPanel;
      case panels.shippingDetailsPanel: return this.context.ShippingDetailsPanel || ShippingDetailsPanel;
      case panels.shippingOptionsPanel: return this.context.ShippingOptionsPanel || ShippingOptionsPanel;
      case panels.paymentDetailsPanel:  return this.context.PaymentDetailsPanel  || PaymentDetailsPanel;
  
      default: throw new Error(`Cannot resolve panel component ${name}`);
    }
  }

  getPanel(index) {
    const panelKey = this.getPanelKey(index);
    return this.props.panels[panelKey];
  }

  getPanelKey(index) {
    return index;
  }

  getFirstIndexWithStatus(status) {
    return this.props.panels.findIndex(panel => panel.status === status);
  }

  setStatus(index, status) {
    const panelKey = this.getPanelKey(index);
    this.props.setPanelStatus(panelKey, status);
  }
}

_PanelManager.contextType = OverrideContext;

const mapStateToProps = state => {
  return {
    panels: state.panelManager,
  };
};

const actions = {
  pushPanel: pushPanel,
  popToPanel: popToPanel,
  setPanelStatus: setPanelStatus,
  resetAllPanels: resetAllPanels,
};

export const PanelManager = connect(mapStateToProps, actions)(_PanelManager);
