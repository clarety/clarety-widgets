import React from 'react';
import { connect } from 'react-redux';
import { Col, Row, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

const _CartHeader = ({ isBusy }) => (
    <Row className="cart-widget__header">
        <Col>
            {isBusy
                ? <Spinner animation="border" size="sm" />
                : <span><FontAwesomeIcon icon={faShoppingCart} /> Cart</span>
            }
        </Col>
        <Col className="text-right">
            <button type="button" className="close" aria-label="Close" onClick={window.hideCartModal}>
                <span aria-hidden="true"><FontAwesomeIcon icon={faTimes} /></span>
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
