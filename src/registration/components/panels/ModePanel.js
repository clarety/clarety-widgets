import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';

export class ModePanel extends BasePanel {
  onSelectMode = (mode) => {
    const { setRegistrationMode, nextPanel } = this.props;

    setRegistrationMode(mode);
    nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
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
          intlId="modePanel.doneTitle"
          onPressEdit={this.onPressEdit}
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

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
