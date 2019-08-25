import React from 'react';
import { connect } from 'react-redux';
import { panels } from 'checkout/actions';
import { LoginPanel, PersonalDetailsPanel, ShippingDetailsPanel, ShippingOptionsPanel, PaymentDetailsPanel } from 'checkout/components';

class _PanelStack extends React.Component {
  constructor(props) {
    super(props);

    this.panelRefs = props.panels.map(panel => React.createRef());
  }

  resetPanelData = () => {
    for (let panelRef of this.panelRefs) {
      panelRef.current.resetPanelData();
    }
  };

  render() {
    const { panels } = this.props;
    
    return panels.map((panel, index) => {
      const PanelComponent = resolvePanelComponent(panel.name);

      return (
        <PanelComponent
          status={panel.status}
          key={index}
          index={index}
          ref={this.panelRefs[index]}
          resetPanelData={this.resetPanelData}
        />
      );
    });
  }
}

function resolvePanelComponent(name) {
  switch (name) {
    case panels.loginPanel:           return LoginPanel;
    case panels.personalDetailsPanel: return PersonalDetailsPanel;
    case panels.shippingDetailsPanel: return ShippingDetailsPanel;
    case panels.shippingOptionsPanel: return ShippingOptionsPanel;
    case panels.paymentDetailsPanel:  return PaymentDetailsPanel;

    default: throw new Error(`Cannot resolve panel component ${name}`);
  }
}

const mapStateToProps = state => {
  return {
    panels: state.panels,
  };
};

const actions = {};

export const PanelStack = connect(mapStateToProps, actions, null, { forwardRef: true })(_PanelStack);
