import React from 'react';
import { connect } from 'react-redux';
import { panels, pushPanel, popToPanel, nextPanel, editPanel, resetPanels } from 'shared/actions';
import { OverrideContext } from 'shared/utils';
import { LoginPanel, PersonalDetailsPanel, ShippingDetailsPanel, ShippingOptionsPanel, PaymentDetailsPanel } from 'checkout/components';
import { ScrollIntoView, EventPanel, QtysPanel, NamesPanel, DetailsPanel, TeamPanel, DonatePanel, ReviewPanel } from 'registrations/components';

class _PanelStack extends React.Component {
  constructor(props) {
    super(props);

    this.panelRefs = props.panelStack.map(panel => React.createRef());
  }

  nextPanel = index => {
    this.props.nextPanel();
  };

  editPanel = index => {
    this.props.editPanel(index);
  };

  pushPanel = panel => {
    this.props.pushPanel(panel);
  };

  popToPanel = index => {
    this.props.popToPanel(index);
  };

  resetPanels = () => {
    this.props.resetPanels();
  };

  resetPanelData = () => {
    for (let panelRef of this.panelRefs) {
      panelRef.current.resetPanelData();
    }
  };

  render() {
    return this.props.panelStack.map(this.renderPanel);
  }

  renderPanel = (panel, index) => {
    const { panelStack, layout } = this.props;
    const PanelComponent = this.resolvePanelComponent(panel.name);
    
    const status = panel.status || (panelStack.length - 1 === index ? 'edit' : 'done');
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

          resetPanels={this.resetPanels}
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
}

_PanelStack.contextType = OverrideContext;

const mapStateToProps = state => {
  return {
    panelStack: state.panelStack,
  };
};

const actions = {
  pushPanel: pushPanel,
  popToPanel: popToPanel,
  nextPanel: nextPanel,
  editPanel: editPanel,
  resetPanels: resetPanels,
};

export const PanelStack = connect(mapStateToProps, actions)(_PanelStack);
