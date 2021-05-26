import React from 'react';
import { connect } from 'react-redux';
import { Col, Row, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { t } from 'shared/translations';

const _CartHeader = ({ isBusy }) => (
    <Row className="cart-widget__header">
        <Col>
            {isBusy
                ? <Spinner animation="border" size="sm" />
                : <span><FontAwesomeIcon icon={faShoppingCart} /> {t('cart', 'Cart')}</span>
            }
        </Col>
        <Col className="text-right">
            <button type="button" className="close" aria-label={t('close', 'Close')} onClick={window.hideCartModal}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </Col>
    </Row>
);

const mapStateToProps = state => {
    return {
        isBusy: state.isBusy,
    };
};

export const CartHeader = connect(mapStateToProps)(_CartHeader);
