import React from 'react';
import { connect } from 'react-redux';
import { OverrideContext } from 'shared/utils';
import { LoginPanel, PersonalDetailsPanel, ShippingDetailsPanel, ShippingOptionsPanel, PaymentDetailsPanel } from 'checkout/components';
import { ScrollIntoView, EventPanel, QtysPanel, NamesPanel, DetailsPanel, TeamPanel, DonatePanel, ReviewPanel } from 'registrations/components';
import { panels as checkoutPanels } from 'checkout/actions';
import { pushPanel, popToPanel, panels as regoPanels } from 'registrations/actions';

class _PanelStack extends React.Component {
  constructor(props) {
    super(props);

    this.panelRefs = props.panelStack.map(panel => React.createRef());
  }

  resetPanelData = () => {
    for (let panelRef of this.panelRefs) {
      panelRef.current.resetPanelData();
    }
  };

  render() {
    return this.props.panelStack.map(this.renderPanel);
  }

  renderPanel = (panel, index) => {
    const { panelStack, layout, pushPanel, popToPanel } = this.props;
    const PanelComponent = this.resolvePanelComponent(panel.name);
    
    const status = panel.status || (panelStack.length - 1 === index ? 'edit' : 'done');
    const shouldScroll = layout === 'stack' && status === 'edit';
    const className = layout === 'stack' ? 'section' : undefined;

    return (
      <ScrollIntoView isActive={shouldScroll} key={index} className={className}>
        <PanelComponent
          status={status}
          key={index}
          index={index}
          ref={this.panelRefs[index]}
          resetPanelData={this.resetPanelData}
          pushPanel={pushPanel}
          popToPanel={() => popToPanel(index)}
          {...panel.props}
        />
      </ScrollIntoView>
    );
  };

  resolvePanelComponent(name) {
    switch (name) {
      case regoPanels.eventPanel:   return this.context.EventPanel   || EventPanel;
      case regoPanels.qtysPanel:    return this.context.QtysPanel    || QtysPanel;
      case regoPanels.namesPanel:   return this.context.NamesPanel   || NamesPanel;
      case regoPanels.detailsPanel: return this.context.DetailsPanel || DetailsPanel;
      case regoPanels.teamPanel:    return this.context.TeamPanel    || TeamPanel;
      case regoPanels.donatePanel:  return this.context.DonatePanel  || DonatePanel;
      case regoPanels.reviewPanel:  return this.context.ReviewPanel  || ReviewPanel;

      case checkoutPanels.loginPanel:           return this.context.LoginPanel           || LoginPanel;
      case checkoutPanels.personalDetailsPanel: return this.context.PersonalDetailsPanel || PersonalDetailsPanel;
      case checkoutPanels.shippingDetailsPanel: return this.context.ShippingDetailsPanel || ShippingDetailsPanel;
      case checkoutPanels.shippingOptionsPanel: return this.context.ShippingOptionsPanel || ShippingOptionsPanel;
      case checkoutPanels.paymentDetailsPanel:  return this.context.PaymentDetailsPanel  || PaymentDetailsPanel;
  
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
};

export const PanelStack = connect(mapStateToProps, actions)(_PanelStack);
