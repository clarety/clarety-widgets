import React from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { TestData } from '../../shared/components';
import { connectSuccessPanel } from '../utils/donate-utils';

export class SuccessPanel extends React.Component {
  render() {
    return this.renderContent();
  }

  renderContent() {
    const { donation, forceMd } = this.props;

    return (
      <Card>
        <TestData testId="result" data={donation} />

        <Card.Header className="text-center">
          Donation Received
        </Card.Header>

        <Row className="justify-content-center">
          <Col lg={forceMd ? null : 8}>

            <Card.Body>
              <Card.Text>Thank you for your kind donation to Human Fund, your generosity is greatly appreciated. A receipt has be sent to your email address. All donations over $2 are tax deductible.</Card.Text>
              <Card.Text>If you have any issues or inquiries please don't hesitate to email <a href="mailto:gcostanza@humanfund.org">gcostanza@humanfund.org</a>.</Card.Text>
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

          </Col>
        </Row>

        <Card.Footer></Card.Footer>
      </Card>
    );
  }
}

export default connectSuccessPanel(SuccessPanel);
