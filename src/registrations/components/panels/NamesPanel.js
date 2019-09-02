import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { TextInput } from 'checkout/components';
import { panels } from 'registrations/actions';
import { getParticipantCount } from 'registrations/selectors';
import { calcProgress } from 'registrations/utils';

class _NamesPanel extends React.Component {
  onClickNext = event => {
    event.preventDefault();

    if (!this.canContinue()) return;

    const { pushPanel, participantCount } = this.props;

    pushPanel({
      name: panels.detailsPanel,
      data: {
        progress: calcProgress(participantCount, 0),
        participantIndex: 0,
      },
    });
  };

  onClickEdit = () => {
    this.props.popToPanel();
  };

  componentWillUnmount() {
    // TODO: reset form data...
    // this.props.resetFirstNames();
  }

  render() {
    if (this.props.isDone) {
      return this.renderDone();
    } else {
      return this.renderEdit();
    }
  }

  renderEdit() {
    return (
      <Container>
        <FormattedMessage id="namesPanel.editTitle" tagName="h2" />

        <Form onSubmit={this.onClickNext} className="panel-body panel-body-names">
          {this.renderRows()}

          <div className="text-center mt-5">
            <Button type="submit" disabled={!this.canContinue()}>
              <FormattedMessage id="btn.next" />
            </Button>
          </div>
        </Form>
      </Container>
    );
  }

  renderRows() {
    const { participantCount, formData } = this.props;
    const rows = [];

    for (let index = 0; index < participantCount; index++) {
      const type = formData[`participants[${index}].type`];

      rows.push(
        <Row key={index} className="mb-3 align-items-center">
          <Col xs={2}>
            <span className="circle">{index + 1}</span>
          </Col>
          <Col>
            <FormattedMessage id={`namesPanel.${type}.title`}>
              {txt => <p className="lead m-0">{txt}</p>}
            </FormattedMessage>
          </Col>
          <Col>
          <FormattedMessage id={`label.firstName`}>
            {label =>
              <TextInput field={`participants[${index}].customer.firstName`} placeholder={label} />
            }
            </FormattedMessage>
          </Col>
        </Row>
      );
    }

    return rows;
  }

  renderDone() {
    const { participantCount, formData } = this.props;

    const rows = [];

    for (let index = 0; index < participantCount; index++) {
      rows.push(
        <React.Fragment key={index}>
          <span className="lead">{index + 1}. {formData[`participants[${index}].customer.firstName`]}</span>
          <br />
        </React.Fragment>
      );
    }

    return (
      <Container>
        <FormattedMessage id="namesPanel.doneTitle" tagName="h4" />

        <p>{rows}</p>

        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.edit" />
        </Button>
      </Container>
    );
  }

  canContinue() {
    const { participantCount, formData } = this.props;

    for (let index = 0; index < participantCount; index++) {
      if (!formData[`participants[${index}].customer.firstName`]) {
        return false;
      }
    }

    return true;
  }
}

const mapStateToProps = state => {
  return {
    formData: state.formData,
    participantCount: getParticipantCount(state),
  };
};

const actions = {};

export const NamesPanel = connect(mapStateToProps, actions)(_NamesPanel);
