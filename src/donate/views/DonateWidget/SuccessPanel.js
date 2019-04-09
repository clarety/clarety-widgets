import React from 'react';
import { connect } from 'react-redux';
import { Card, Table } from 'react-bootstrap';

const SuccessPanel = ({ donation }) => (
  <Card>
    <Card.Header className="text-center">
      Donation Received
    </Card.Header>

    <Card.Body>
      <Card.Text>
        <p>Thank you for your kind donation to The Human Fund, your generosity is greatly appreciated. A receipt has be sent to your email address. All donations over $2 are tax deductible.</p>
        <p>If you have any issues or inquiries please don't hesitate to email <a href="mailto:gcostanza@humanfund.org">gcostanza@humanfund.org</a>.</p>
      </Card.Text>
    </Card.Body>

    <Table className="mb-0">
      <tbody>
        <tr>
          <th scope="row">Date</th>
          <td>{donation.date}</td>
        </tr>
        <tr>
          <th scope="row">Email</th>
          <td>{donation.email}</td>
        </tr>
        <tr>
          <th scope="row">Frequency</th>
          <td>{donation.frequency}</td>
        </tr>
        <tr>
          <th scope="row">Amount</th>
          <td>{donation.amount}</td>
        </tr>
        <tr>
          <th scope="row">Payment Method</th>
          <td>Card ending in {donation.last4}</td>
        </tr>
      </tbody>
    </Table>
    <Card.Footer></Card.Footer>
  </Card>
);

const mapStateToProps = state => {
  return {
    donation: state.successPanel.donation,
  };
};

export default connect(mapStateToProps)(SuccessPanel);
