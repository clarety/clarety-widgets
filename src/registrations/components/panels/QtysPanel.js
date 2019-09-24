import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Col } from 'react-bootstrap';
import { panels } from 'shared/actions';
import { BasePanel, Qty, QtyInput } from 'registrations/components';
import { setQtys, resetQtys } from 'registrations/actions';
import { getRegistrationTypes } from 'registrations/selectors';

class _QtysPanel extends BasePanel {
  state = {};

  onClickNext = () => {
    this.props.setQtys(this.state);
    this.props.pushPanel({
      panel: panels.namesPanel,
      progress: 40,
    });
  };

  onClickEdit = () => {
    this.props.popToPanel();
  };

  componentWillUnmount() {
    this.props.resetQtys();
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

  renderQtyInputs() {
    const { types } = this.props;

    return Object.keys(types).map(key =>
      <Form.Group key={key}>
        <Form.Row className="align-items-center">
          <Col>
            <Form.Label className="form-label-qty">
              <FormattedMessage id={`qtysPanel.${key}.title`} tagName="h4" />
              <FormattedMessage id={`qtysPanel.${key}.subtitle`}>
                {txt => <span className="text-muted">{txt}</span>}
              </FormattedMessage>
            </Form.Label>
          </Col>
          <Col>
            <QtyInput
              value={this.state[key] || 0}
              onChange={qty => this.setState({ [key]: qty })}
            />
          </Col>
        </Form.Row>
      </Form.Group>
    );
  }

  canContinue() {
    for (let key in this.state) {
      if (this.state[key]) return true;
    }

    return false;
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
};

export const QtysPanel = connect(mapStateToProps, actions)(_QtysPanel);
