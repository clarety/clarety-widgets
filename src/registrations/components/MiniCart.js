import React from 'react';
import { connect } from 'react-redux';
import { Navbar, ProgressBar, Row, Col } from 'react-bootstrap';
import { Brand, Qty } from 'registrations/components';
import { getEventName, getProgress, getPanel } from 'registrations/selectors';
import { panels } from 'registrations/actions';
import { OverrideContext } from 'registrations/utils';

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
            {qtys && Object.keys(qtys).map(key =>
              <Qty key={key} type={key} qty={qtys[key]} />
            )}
          </Col>
        </Row>
        <ProgressBar now={progress} />
      </Navbar>
    );
  }
}

_MiniCart.contextType = OverrideContext;

const mapStateToProps = state => {
  const qtysPanel = getPanel(state, panels.qtysPanel);

  return {
    eventName: getEventName(state),
    qtys: qtysPanel && qtysPanel.data.qtys,
    progress: getProgress(state),
  };
};

export const MiniCart = connect(mapStateToProps)(_MiniCart);
