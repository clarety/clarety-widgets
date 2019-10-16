import React from 'react';
import { connect } from 'react-redux';
import { Navbar, ProgressBar, Row, Col } from 'react-bootstrap';
import { Brand, Qty } from 'registration/components';
import { getEventName, getQtys, getCartTotal, getProgress } from 'registration/selectors';
import { OverrideContext } from 'shared/utils';

class _MiniCart extends React.Component {
  render() {
    const { eventName, qtys, cartTotal, progress } = this.props;
    const BrandComponent = this.context.Brand || Brand;

    return (
      <Navbar sticky="top">
        <Row noGutters>
          <Col>
            <BrandComponent />
          </Col>

          <Col className="d-none d-sm-block">
            {eventName}
          </Col>

          <Col className="d-none d-sm-block">
            {Object.keys(qtys).map(key =>
              <Qty key={key} type={key} qty={qtys[key]} />
            )}
          </Col>

          <Col className="d-none d-sm-block">
            {cartTotal}
          </Col>
        </Row>
        <Row>
          <ProgressBar now={progress} />
        </Row>
      </Navbar>
    );
  }
}

_MiniCart.contextType = OverrideContext;

const mapStateToProps = state => {
  return {
    eventName: getEventName(state),
    qtys: getQtys(state),
    cartTotal: getCartTotal(state),
    progress: getProgress(state),
  };
};

export const MiniCart = connect(mapStateToProps)(_MiniCart);
