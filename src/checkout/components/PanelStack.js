import React from 'react';
import { connect } from 'react-redux';
import { panels } from 'checkout/actions';
import { ContactDetailsPanel, PersonalDetailsPanel, ShippingDetailsPanel, ShippingOptionsPanel, PaymentDetailsPanel } from 'checkout/components';

const _PanelStack = ({ panels }) => {
  return panels.map((panel, index) => {
    const PanelComponent = resolvePanelComponent(panel.name);
    return <PanelComponent status={panel.status} key={index} index={index} />
  });
};

function resolvePanelComponent(name) {
  switch (name) {
    case panels.contactDetailsPanel:  return ContactDetailsPanel;
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

export const PanelStack = connect(mapStateToProps, actions)(_PanelStack);
