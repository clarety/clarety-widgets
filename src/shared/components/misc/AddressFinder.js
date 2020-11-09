import React from 'react';
import { Form } from 'react-bootstrap';
import { setupAddressFinder } from 'shared/utils';

export class AddressFinder extends React.Component {
  addressFinderInstace = null;

  componentDidMount() {
    setupAddressFinder({
      elementId: this.props.id,
      apiKey: this.props.apiKey,
      country: this.props.country,
      onLoad: (addressFinder) => this.addressFinderInstace = addressFinder,
      onSelect: this.props.onSelect,
    });
  }

  componentWillUnmount() {
    if (this.addressFinderInstace) {
      this.addressFinderInstace.destroy();
      this.addressFinderInstace = null;
    }
  }

  render() {
    const { id, defaultValue } = this.props;

    return (
      <Form.Control
        id={id}
        defaultValue={defaultValue}
      />
    );
  }
}
