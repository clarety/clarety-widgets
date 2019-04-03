import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Card, InputGroup } from 'react-bootstrap';

const VariableAmount = ({ value, data, isSelected, amountChange, currency }) => {
  let input = React.createRef();
  const label = `${currency.code} ${currency.symbol}`;

  return (
    <Card
      className="mt-2"
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => input.current.focus()}
    >
      <Row noGutters>
        <Col xs={4}>
          <Card.Img src={data.image} />
        </Col>
        <Col xs={8}>
        <Card.Body>
          <Card.Title className="mb-3">{data.desc}</Card.Title>
          <Card.Text as="div">
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>{label}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required={isSelected}
                ref={input}
                value={value}
                className="text-right"
                type="number"
                min="0"
                onFocus={event => amountChange(parseFloat(event.target.value))}
                onChange={event => amountChange(parseFloat(event.target.value))}
              />
            </InputGroup>
          </Card.Text>
        </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.currency,
  }
};

export default connect(mapStateToProps)(VariableAmount);
