import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Container, ProgressBar, Row, Col } from 'react-bootstrap';
import { Qty } from 'registration/components';
import { getEventName, getQtys, getFormattedCartTotal, getProgress } from 'registration/selectors';

class _MiniCart extends React.Component {
  render() {
    const { eventName, qtys, cartTotal, progress, resources } = this.props;
    const NavBarBrand = resources.getComponent('NavBarBrand');

    return (
      <Navbar sticky="top">
        <Container>
          <Row noGutters>
            <Col>
              <NavBarBrand />
            </Col>

            <Col className="d-none d-sm-flex align-items-center justify-content-center">
              {eventName}
            </Col>

            <Col className="d-none d-sm-flex align-items-center justify-content-center">
              {Object.keys(qtys).map(key =>
                <Qty key={key} type={key} qty={qtys[key]} />
              )}
            </Col>

            <Col className="d-none d-sm-flex align-items-center justify-content-center">
              {cartTotal}
            </Col>
          </Row>
        </Container>

        <ProgressBar now={progress} />
      </Navbar>
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
