import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button } from 'react-bootstrap';
import { createRegistration, submitRegistration } from 'registrations/actions';

class _ReviewPanel extends React.Component {
  onClickNext = () => {
    this.props.submitRegistration();
  };

  onClickRetry = () => {
    this.props.createRegistration();
  };

  render() {
    const { hasErrors, registrations } = this.props;

    if (hasErrors) return this.renderErrors();
    if (registrations) return this.renderReview();
    
    return null;
  }
  
  renderErrors() {
    return (
      <Container>
        <FormattedMessage id="reviewPanel.errorTitle" tagName="h2" />
        <FormattedMessage id="reviewPanel.errorSubtitle" tagName="p" />

        <Button onClick={this.onClickRetry}>
          <FormattedMessage id="btn.retry" />
        </Button>
      </Container>
    );
  }

  renderReview() {
    return (
      <Container>
        <FormattedMessage id="reviewPanel.reviewTitle" tagName="h2" />

        <div className="panel-body text-center">
          {this.props.registrations.map((registration, index) =>
            <p key={index} className="lead">{registration.description}</p>
          )}
        </div>

        <Button onClick={this.onClickNext}>
          <FormattedMessage id="btn.submit" />
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    hasErrors: state.errors.length > 0,
    registrations: state.cart.items,
  };
};

const actions = {
  createRegistration: createRegistration,
  submitRegistration: submitRegistration,
};

export const ReviewPanel = connect(mapStateToProps, actions)(_ReviewPanel);
