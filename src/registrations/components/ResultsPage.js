import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Table, } from 'react-bootstrap';

class _ResultsPage extends React.Component {
  render() {
    const { sale } = this.props;
    
    return (
      <Container className="mt-5">
        <FormattedMessage id="resultsPage.title">
          {txt => <h1 className="display-4">{txt}</h1>}
        </FormattedMessage>

        <FormattedMessage id="resultsPage.orderId" values={{ id: sale.id }}>
          {txt => <p className="lead">{txt}</p>}
        </FormattedMessage>

        <p className="my-5" style={{ whiteSpace: 'pre-line' }}>
          <FormattedMessage id="resultsPage.message" />
        </p>

        <Table striped bordered className="table-sale">
          <thead>
            <tr>
              <th><FormattedMessage id="resultsPage.items" /></th>
              <th><FormattedMessage id="resultsPage.price" /></th>
              <th><FormattedMessage id="resultsPage.qty" /></th>
              <th><FormattedMessage id="resultsPage.total" /></th>
            </tr>
          </thead>
          <tbody>
            {sale.salelines.map((line, index) =>
              <tr key={index}>
                <td>{line.description}</td>
                <td>{line.price}</td>
                <td>{line.quantity}</td>
                <td>{line.total}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    sale: state.registration.sale,
  };
};

export const ResultsPage = connect(mapStateToProps)(_ResultsPage);
