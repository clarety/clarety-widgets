import React from 'react';
import { connect } from 'react-redux';
import { setPanelStatus, resetAllPanels } from 'shared/actions';
import { ScrollIntoView } from 'shared/components';

class _PanelManager extends React.Component {
  components = {};
  panelRefs = [];

  constructor(props) {
    super(props);

    this.setupPanelComponents(props.panels, props.resources);

    if (props.layout === 'page') {
      props.panels.forEach((panel, index) => this.setStatus(index, 'edit'));
    }
  }

  componentDidUpdate(prevPops) {
    // If panels were added after constructor, they need to be setup.
    if (this.props.panels.length !== prevPops.panels.length) {
      this.setupPanelComponents(this.props.panels, this.props.resources);
    }
  }

  setupPanelComponents(panels, resources) {
    panels.forEach(panel => {
      let panelComponent = resources.getComponent(panel.component);

      if (panel.connect) {
        const panelConnect = resources.getConnect(panel.connect);
        panelComponent = connect(
          panelConnect.mapStateToProps,
          panelConnect.actions,
          null,
          { forwardRef: true }
        )(panelComponent);
      }
      
      this.components[panel.component] = panelComponent;
    });
  }

  nextPanel = (currentIndex) => {
    this.setStatus(currentIndex, 'done');

    const nextIndex = this.getFirstIndexWithStatus('wait');
    if (nextIndex !== -1) this.setStatus(nextIndex, 'edit');

    this.panelChangeEvent();
  };

  editPanel = (nextIndex) => {
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

    this.panelChangeEvent();
  };

  resetAllPanels = () => {
    this.props.resetAllPanels();
    this.panelRefs.forEach(panelRef => panelRef && panelRef.reset());
  };

  panelChangeEvent() {
    const event = new Event('clarety-widget--change-panel');
    window.dispatchEvent(event);
  }

  render() {
    return this.props.panels.map(this.renderPanel);
  }

  renderPanel = (panel, index) => {
    const { layout, settings, resources, isPreview } = this.props;
    const PanelComponent = this.components[panel.component];
    const panelSettings = settings.panels[panel.component];
    
    const shouldScroll = layout === 'stack' && panel.status === 'edit';
    const className = shouldScroll ? 'panel panel-last' : 'panel';

    if (!PanelComponent) return null;

    return (
      <ScrollIntoView isActive={shouldScroll} key={panel.id} className={className}>
        <PanelComponent
          index={index}
          status={panel.status}
          layout={layout}
          settings={panelSettings}
          resources={resources}
          isPreview={isPreview}
          
          {...panel.data}

          nextPanel={() => this.nextPanel(index)}
          prevPanel={() => this.editPanel(index - 1)}
          editPanel={() => this.editPanel(index)}
          editPanelAtIndex={this.editPanel}
          resetAllPanels={this.resetAllPanels}

          ref={ref => this.panelRefs[index] = ref}
          panelRefs={this.panelRefs}
        />
      </ScrollIntoView>
    );
  };

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

const mapStateToProps = state => {
  return {
    panels: state.panelManager,
    settings: state.settings,
  };
};

const actions = {
  setPanelStatus: setPanelStatus,
  resetAllPanels: resetAllPanels,
};

export const PanelManager = connect(mapStateToProps, actions)(_PanelManager);
