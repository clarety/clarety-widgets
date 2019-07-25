import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Navbar, ProgressBar, Row, Col } from 'react-bootstrap';
import { Qty } from 'registrations/components';
import { getEventName, getProgress } from 'registrations/selectors';

const _MiniCart = ({ eventName, qtys, progress }) => (
  <Navbar sticky="top">
    <Row noGutters>
      <Col>
        <Navbar.Brand>
          <FormattedMessage id="app.title" />
        </Navbar.Brand>
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
    <ProgressBar now={progress} />
  </Navbar>
);

const mapStateToProps = state => {
  return {
    eventName: getEventName(state),
    qtys: state.panelData.qtys,
    progress: getProgress(state),
  };
};

export const MiniCart = connect(mapStateToProps)(_MiniCart);
