import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Col } from 'react-bootstrap';
import { insertPanels, removePanels } from 'shared/actions';
import { BasePanel, Qty, QtyInput } from 'registrations/components';
import { setQtys, resetQtys } from 'registrations/actions';
import { getRegistrationTypes } from 'registrations/selectors';

class _QtysPanel extends BasePanel {
  state = {
    qtys: {},
  };

  onClickNext = () => {
    const participantCount = this.participantCount();
    this.setupDetailsPanels(participantCount);

    this.props.setQtys(this.state.qtys);
    this.props.nextPanel();
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
        component: 'DetailsPanel',
        data: { participantIndex },
      });
    }

    // Insert new panels.
    insertPanels({
      afterComponent: 'NamesPanel',
      panels: detailsPanels,
    });
  }

  reset() {
    this.setState({ qtys: {} });
    this.props.resetQtys();
  }

  renderWait() {
    return null;
  }

  renderEdit() {
    return (
      <Container>
        <FormattedMessage id="qtysPanel.editTitle" tagName="h2" />

        <Form className="panel-body panel-body-qtys">
          {this.renderQtyInputs()}

          <FormattedMessage id="qtysPanel.message" tagName="p" />
        </Form>

        <Button
          onClick={this.onClickNext}
          disabled={!this.canContinue()}
        >
          <FormattedMessage id="btn.next" />
        </Button>
      </Container>
    );
  }

  renderQtyInputs() {
    const { types } = this.props;

    return Object.keys(types).map(type =>
      <Form.Group key={type}>
        <Form.Row className="align-items-center">
          <Col>
            <Form.Label className="form-label-qty">
              <FormattedMessage id={`qtysPanel.${type}.title`} tagName="h4" />
              <FormattedMessage id={`qtysPanel.${type}.subtitle`}>
                {txt => <span className="text-muted">{txt}</span>}
              </FormattedMessage>
            </Form.Label>
          </Col>
          <Col>
            <QtyInput
              value={this.state.qtys[type] || 0}
              onChange={qty => this.onChangeQty(type, qty)}
            />
          </Col>
        </Form.Row>
      </Form.Group>
    );
  }

  renderDone() {
    const { qtys } = this.props;

    return (
      <Container>
        <FormattedMessage id="qtysPanel.doneTitle" tagName="h4" />

        <p className="lead">
          {Object.keys(qtys).map(key =>
            <Qty key={key} type={key} qty={qtys[key]} />
          )}
        </p>
        
        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.edit" />
        </Button>
      </Container>
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

const mapStateToProps = state => {
  return {
    types: getRegistrationTypes(state),
    qtys: state.panelData.qtys,
  };
};

const actions = {
  setQtys: setQtys,
  resetQtys: resetQtys,
  insertPanels: insertPanels,
  removePanels: removePanels,
};

export const QtysPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_QtysPanel);
