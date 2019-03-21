import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import SubscribeApi from '../api/subscribe-api';
import { setValidationErrors, clearValidationErrors } from '../actions/validationErrorsActions';
import { setFormStatus, formStatuses } from '../actions/formStatusActions';

class SubscribeForm extends React.Component {
  onSubmit = async event => {
    const { formStatus, formData, history } = this.props;
    const { setFormStatus, clearValidationErrors, setValidationErrors } = this.props;

    event.preventDefault();
    if (formStatus !== formStatuses.ready) return;

    setFormStatus(formStatuses.busy);
    clearValidationErrors();
    
    const result = await SubscribeApi.subscribe(formData);

    if (result.status === 'error') {
      setValidationErrors(result.validationErrors);
    } else {
      history.push('/subscribe-success');
    }

    setFormStatus(formStatuses.ready);
  };

  render() {
    const { className, style, testId } = this.props;

    return (
      <Form className={className} style={style} onSubmit={this.onSubmit} data-testid={testId}>
        {this.props.children}
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    formStatus: state.formStatus,
    formData: state.formData,
  };
};

const actions = {
  setFormStatus: setFormStatus,
  setValidationErrors: setValidationErrors,
  clearValidationErrors: clearValidationErrors,
};

export default withRouter(connect(mapStateToProps, actions)(SubscribeForm));
