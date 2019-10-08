import React from 'react';
import { connect } from 'react-redux';
import { setPanelStatus, resetAllPanels } from 'shared/actions';
import { OverrideContext } from 'shared/utils';
import { LoginPanel, PersonalDetailsPanel, AddressPanel, ShippingOptionsPanel, PaymentDetailsPanel } from 'checkout/components';
import { ScrollIntoView, EventPanel, QtysPanel, NamesPanel, DetailsPanel, TeamPanel, DonatePanel, ReviewPanel } from 'registrations/components';

class _PanelManager extends React.Component {
  panelRefs = [];

  nextPanel = currentIndex => {
    this.setStatus(currentIndex, 'done');

    const nextIndex = this.getFirstIndexWithStatus('wait');
    if (nextIndex !== -1) this.setStatus(nextIndex, 'edit');
  };

  editPanel = nextIndex => {
    const { layout, panels } = this.props;

    if (layout === 'stack') {
      for (let panelIndex = 0; panelIndex < panels.length; panelIndex++) {
        const panel = this.getPanel(panelIndex);
        if (panelIndex > nextIndex && panel.status !== 'wait') {
          this.setStatus(panelIndex, 'wait');
          this.resetPanel(panelIndex);
        }
      }
    } else {
      const currentIndex = this.getFirstIndexWithStatus('edit');
      if (currentIndex !== -1) this.setStatus(currentIndex, 'wait');
    }
    
    this.setStatus(nextIndex, 'edit');
  };

  resetAllPanels = () => {
    this.props.resetAllPanels();
    this.panelRefs.forEach(panelRef => panelRef && panelRef.reset());
  };

  render() {
    return this.props.panels.map(this.renderPanel);
  }

  renderPanel = (panel, index) => {
    const { layout } = this.props;
    const PanelComponent = this.resolvePanelComponent(panel);
    
    const shouldScroll = layout === 'stack' && panel.status === 'edit';
    const className = layout === 'stack' ? 'section' : undefined;

    return (
      <ScrollIntoView isActive={shouldScroll} key={panel.id} className={className}>
        <PanelComponent
          key={panel.id}
          index={index}
          ref={ref => this.panelRefs[index] = ref}

          status={panel.status}
          layout={layout}
          settings={panel.settings}
          {...panel.data}

          nextPanel={() => this.nextPanel(index)}
          editPanel={() => this.editPanel(index)}
          resetAllPanels={this.resetAllPanels}
        />
      </ScrollIntoView>
    );
  };

  resolvePanelComponent(panel) {
    switch (panel.component) {
      // Checkout panels
      case 'LoginPanel':           return this.context.LoginPanel           || LoginPanel;
      case 'PersonalDetailsPanel': return this.context.PersonalDetailsPanel || PersonalDetailsPanel;
      case 'AddressPanel': return this.context.AddressPanel || AddressPanel;
      case 'ShippingOptionsPanel': return this.context.ShippingOptionsPanel || ShippingOptionsPanel;
      case 'PaymentDetailsPanel':  return this.context.PaymentDetailsPanel  || PaymentDetailsPanel;

      // Registrations panels
      case 'EventPanel':           return this.context.EventPanel           || EventPanel;
      case 'QtysPanel':            return this.context.QtysPanel            || QtysPanel;
      case 'NamesPanel':           return this.context.NamesPanel           || NamesPanel;
      case 'DetailsPanel':         return this.context.DetailsPanel         || DetailsPanel;
      case 'TeamPanel':            return this.context.TeamPanel            || TeamPanel;
      case 'DonatePanel':          return this.context.DonatePanel          || DonatePanel;
      case 'ReviewPanel':          return this.context.ReviewPanel          || ReviewPanel;

      default: throw new Error(`Cannot resolve panel component ${panel.component}`);
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

  resetPanel(index) {
    this.panelRefs[index].reset();
  }
}

_PanelManager.contextType = OverrideContext;

const mapStateToProps = state => {
  return {
    panels: state.panelManager,
  };
};

const actions = {
  setPanelStatus: setPanelStatus,
  resetAllPanels: resetAllPanels,
};

export const PanelManager = connect(mapStateToProps, actions)(_PanelManager);
