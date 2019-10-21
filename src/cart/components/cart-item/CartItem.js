import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { QtyInput, TotalLine, CartItemDescription, CartItemVariationDescription } from 'cart/components';
import { updateItemQuantity } from 'cart/actions';

class _CartItem extends React.Component {
    timeout = null;
    time = 250;

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.item.quantity,
        };
    }

    onInputChange = (text) => {
        const quantity = text ? Number(text) : '';

        this.setState({ quantity: quantity });

        if (quantity !== '') {
            this.onQuantityChange(quantity);
        }
    };

    onQuantityChange = (quantity) => {
        const { updateItemQuantity, item } = this.props;

        this.setState({quantity: quantity});
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => updateItemQuantity(item, quantity), this.time);
    };

    render() {
        const { item } = this.props;
        const { quantity } = this.state;

        return (
            <div className="cart-widget__summary__item" key={item.id}>
                <Row className="align-items-center">
                    <Col xs={3}>
                        <img src={item.image} className="img-fluid"/>
                    </Col>
                    <Col xs={9}>
                        <CartItemDescription
                            key={item.id}
                            item={item}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-end">
                    <TotalLine label="Amount" value={item.price} />
                    <CartItemVariationDescription
                        key={item.id}
                        item={item}
                    />
                    <Col as="dt" xs={9}>
                        Quantity
                    </Col>
                    <Col as="dd" xs={3} className="text-right">
                        <QtyInput
                            value={quantity}
                            onChange={ this.onQuantityChange }
                            onInputChange={ this.onInputChange }
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const actions = {
    updateItemQuantity: updateItemQuantity
};

export const CartItem = connect(mapStateToProps, actions)(_CartItem);