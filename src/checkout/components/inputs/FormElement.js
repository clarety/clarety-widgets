import React from 'react';
import { FormContext } from 'shared/utils';

class PureFormElement extends React.PureComponent {
  constructor(props) {
    super(props);

    props.onChange(props.field, props.value);
  }

  render() {
    return null;
  }
}

export class FormElement extends React.Component {
  render() {
    return (
      <PureFormElement
        onChange={this.context.onChange}
        {...this.props}
      />
    );
  }
}

FormElement.contextType = FormContext;
