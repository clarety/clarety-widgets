import React from 'react';
import { connect } from 'react-redux';
import { Navbar, ProgressBar, Row, Col } from 'react-bootstrap';
import { Brand, Qty } from 'registrations/components';
import { getEventName, getProgress } from 'registrations/selectors';
import { OverrideContext } from 'shared/utils';

class _MiniCart extends React.Component {
  render() {
    const { eventName, qtys, progress } = this.props;
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
    qtys: state.panelData.qtys,
    progress: getProgress(state),
  };
};

export const MiniCart = connect(mapStateToProps)(_MiniCart);