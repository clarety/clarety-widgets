import React from 'react';
import { Form, Row, Col, Card, InputGroup } from 'react-bootstrap';

const DonationOption = ({ value, data, isSelected, amountChange }) => {
  let amountInput = React.createRef();

  return (
    <Card
      className="mt-2"
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => amountInput.current.focus()}
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
                <InputGroup.Text>{data.label}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                value={value}
                className="text-right"
                type="number"
                min="0"
                onFocus={event => amountChange(event.target.value)}
                onChange={event => amountChange(event.target.value)}
                ref={amountInput}
              />
            </InputGroup>
          </Card.Text>
        </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default DonationOption;
