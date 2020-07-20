import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Breakpoint } from 'react-socks';
import { t } from 'shared/translations';
import { Qty, LanguageSelect } from 'registration/components';
import { getEventName, getQtys, getFormattedCartTotal, getProgress } from 'registration/selectors';

class _MiniCart extends React.Component {
  render() {
    const { eventName, qtys, cartTotal, progress, resources } = this.props;
    const MiniCartBrand = resources.getComponent('MiniCartBrand');

    return (
      <div className="mini-cart">
        <Container>
          <Breakpoint medium down>
            <Row noGutters>
              <Col>
                <MiniCartBrand title={t('app.title', 'Registration')} />
              </Col>
              <Col>
                <div><LanguageSelect /></div>
                <div className="mini-cart__cart-total">{cartTotal}</div>
              </Col>
            </Row>
          </Breakpoint>

          <Breakpoint large up>
            <Row noGutters>
              <Col>
                <MiniCartBrand title={t('app.title', 'Registration')} />
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
                <div><LanguageSelect /></div>
                <div className="mini-cart__cart-total">{cartTotal}</div>
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
