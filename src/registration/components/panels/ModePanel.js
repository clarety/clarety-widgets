import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { BasePanel } from 'registration/components';
import { setRegistrationMode } from 'registration/actions';
import { getRegistrationMode } from 'registration/selectors';

class _ModePanel extends BasePanel {
  onSelectMode = (mode) => {
    const { setRegistrationMode, nextPanel } = this.props;

    setRegistrationMode(mode);
    nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  renderWait() {
    return null;
  }

  renderEdit() {
    const { layout, isBusy, index } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Registration"
          intlId="modePanel.editTitle"
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          <p>Are you registering as an individual, group, or family?</p>

          <div className="panel-actions">
            <Button onClick={() => this.onSelectMode('individual')}>Individual</Button>
            <Button onClick={() => this.onSelectMode('group')}>Group</Button>
            <Button onClick={() => this.onSelectMode('family')}>Family</Button>
          </div>

        </PanelBody>
      </PanelContainer>
    );
  }
  
  renderDone() {
    const { layout, index, selectedMode } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={selectedMode}
          onPressEdit={this.onPressEdit}
          intlId="modePanel.doneTitle"
        />

        <PanelBody layout={layout} status="done">

          <p>{capitalize(selectedMode)} Registration</p>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedMode: getRegistrationMode(state),
  };
};

const actions = {
  setRegistrationMode,
};

export const ModePanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ModePanel);

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
