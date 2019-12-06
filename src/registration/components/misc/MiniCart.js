import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Container, ProgressBar, Row, Col } from 'react-bootstrap';
import { Resources } from 'shared/utils';
import { Qty } from 'registration/components';
import { getEventName, getQtys, getCartTotal, getProgress } from 'registration/selectors';

class _MiniCart extends React.Component {
  render() {
    const { eventName, qtys, cartTotal, progress } = this.props;
    const NavBarBrand = Resources.getComponent('NavBarBrand');

    return (
      <Navbar sticky="top">
        <Container>
          <Row noGutters>
            <Col>
              <NavBarBrand />
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
    cartTotal: getCartTotal(state),
    progress: getProgress(state),
  };
};

export const MiniCart = connect(mapStateToProps)(_MiniCart);
