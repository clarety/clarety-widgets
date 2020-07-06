import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Breakpoint } from 'react-socks';
import { Qty } from 'registration/components';
import { getEventName, getQtys, getFormattedCartTotal, getProgress } from 'registration/selectors';

class _MiniCart extends React.Component {
  render() {
    const { eventName, qtys, cartTotal, progress, resources } = this.props;
    const MiniCartBrand = resources.getComponent('MiniCartBrand');

    return (
      <div className="mini-cart">
        <Container>
          <Breakpoint small down>
            <Row noGutters>
              <Col>
                <MiniCartBrand title={<FormattedMessage id="app.title" defaultMessage="Registration" />} />
              </Col>
            </Row>
          </Breakpoint>

          <Breakpoint medium up>
            <Row noGutters>
              <Col>
                <MiniCartBrand title={<FormattedMessage id="app.title" defaultMessage="Registration" />} />
              </Col>
              <Col>
                {eventName}
              </Col>
              <Col>
                {Object.keys(qtys).map(key =>
                  <Qty key={key} type={key} qty={qtys[key]} />
                )}
              </Col>
              <Col>
                {cartTotal}
              </Col>
            </Row>
          </Breakpoint>
        </Container>

        <ProgressBar now={progress} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    eventName: getEventName(state),
    qtys: getQtys(state),
    cartTotal: getFormattedCartTotal(state),
    progress: getProgress(state),
  };
};

export const MiniCart = connect(mapStateToProps)(_MiniCart);
