import React from 'react';
import { Button, Form, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { DetailsPanel, DetailsConnect, Qty, QtyInput } from 'registration/components';

export class QtysPanel extends BasePanel {
  state = {
    qtys: {},
  };

  onShowPanel() {
    const { registrationMode, types } = this.props;
    if (!types) return;
      
    const typeKeys = Object.keys(types);

    // Skip panel for individuals if there's only one type.
    if (registrationMode === 'individual' && typeKeys.length === 1) {
      this.onSelectType(typeKeys[0]);
    }
  }

  onClickNext = async () => {
    const { setQtys, nextPanel } = this.props;

    const participantCount = this.participantCount();
    this.setupDetailsPanels(participantCount);

    setQtys(this.state.qtys);
    nextPanel();
  };

  onSelectType = async (type) => {
    const { setQtys, nextPanel } = this.props;

    const qtys = { [type]: 1 };
    this.setState({ qtys });

    this.setupDetailsPanels(1);

    setQtys(qtys);
    nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  onChangeQty = (type, qty) => {
    this.setState(prevState => ({
      qtys: {
        ...prevState.qtys,
        [type]: qty,
      }
    }));
  };

  setupDetailsPanels(participantCount) {
    const { insertPanels, removePanels } = this.props;

    // Remove existing details panels.
    removePanels({ withComponent: 'DetailsPanel' });

    // Build array of new panels.
    const detailsPanels = [];
    for (let participantIndex = 0; participantIndex < participantCount; participantIndex++) {
      detailsPanels.push({
        component: DetailsPanel,
        connect: DetailsConnect,
        data: {
          participantIndex,
          isLastParticipant: participantIndex+1 === participantCount,
        },
      });
    }

    // Insert new panels.
    insertPanels({
      afterComponent: 'OffersPanel',
      panels: detailsPanels,
    });
  }

  reset() {
    this.setState({ qtys: {} });
    this.props.resetQtys();
  }

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
    const { layout, index, registrationMode } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="qtys-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('qtysPanel.editTitle', 'Participant Selection')}
        />

        <PanelBody layout={layout} status="edit">
          {registrationMode === 'individual'
            ? this.renderIndividualForm()
            : this.renderGroupForm()
          }
        </PanelBody>
      </PanelContainer>  
    );
  }

  renderIndividualForm() {
    return (
      <React.Fragment>
        <Form>
          {this.renderBtnInputs()}
          <p>{t('qtysPanel.message', '')}</p>
        </Form>
      </React.Fragment>
    );
  }  

  renderGroupForm() {
    return (
      <React.Fragment>
        <Form>
          {this.renderQtyInputs()}
          <p>{t('qtysPanel.message', '')}</p>
        </Form>

        <div className="panel-actions">
          <Button onClick={this.onClickNext} disabled={!this.canContinue()}>
            {t('btn.next', 'Next')}
          </Button>
        </div>
      </React.Fragment>
    );
  }

  renderBtnInputs() {
    const { types } = this.props;
    if (!types) return null;

    return Object.entries(types).map(([key, type]) =>
      <div className="m-3" key={key}>
        <Button onClick={() => this.onSelectType(key)}>
          {this.getTypeTitle(type, true)}
        </Button>
        <p className="text-muted">{this.getTypeSubtitle(type)}</p>
      </div>
    );
  }

  renderQtyInputs() {
    const { types } = this.props;
    if (!types) return null;

    return Object.entries(types).map(([key, type]) =>
      <Form.Group key={key}>
        <Form.Row className="align-items-center">
          <Col>
            <Form.Label className="form-label-qty">
              <h4>{this.getTypeTitle(type)}</h4>
              <p className="text-muted">{this.getTypeSubtitle(type)}</p>
            </Form.Label>
          </Col>
          <Col xs="auto">
            <QtyInput
              value={this.state.qtys[key] || 0}
              onChange={qty => this.onChangeQty(key, qty)}
            />
          </Col>
        </Form.Row>
      </Form.Group>
    );
  }

  getTypeTitle(type, isIndividual = false) {
    if (type.registrationType === 'adult') {
      if (isIndividual) {
        return t('adult', 'Adult');
      } else {
        return t('qtysPanel.adult-title', 'Adults');
      }
    }

    if (type.registrationType === 'child') {
      if (isIndividual) {
        return t('child', 'Child');
      } else {
        return t('qtysPanel.child-title', 'Children');
      }
    }

    return undefined;
  }

  getTypeSubtitle(type) {
    if (type.registrationType === 'adult') return t('qtysPanel.adult-subtitle', type.description);
    if (type.registrationType === 'child') return t('qtysPanel.child-subtitle', type.description);
    return undefined;
  }

  renderDone() {
    const { layout, index, qtys } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={t('qtysPanel.doneTitle', 'Registration')}
          onPressEdit={this.onPressEdit}
        />
        <PanelBody layout={layout} status="done">

          <div className="qtys mb-3">
            {Object.keys(qtys).map(key =>
              <Qty key={key} type={key} qty={qtys[key]} />
            )}
          </div>
          
          <Button onClick={this.onClickEdit}>
            {t(['qtysPanel.editBtn', 'btn.edit'], 'Edit')}
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }

  canContinue() {
    for (let key in this.state.qtys) {
      if (this.state.qtys[key]) return true;
    }

    return false;
  }

  participantCount() {
    return Object.values(this.state.qtys).reduce((sum, value) => sum + value, 0);
  }
}
