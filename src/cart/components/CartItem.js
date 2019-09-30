import React from 'react';
import { connect } from "react-redux";
import { QtyInput, TotalLine, CartItemDescription, CartItemVariationDescription } from "cart/components";
import { updateItemQuantity } from "../actions";
import { currency } from "shared/utils";
import { Row, Col } from "react-bootstrap";

class _Item extends React.Component {
    timeout = null;
    time = 250;

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.item.quantity,
        };
    }

    onInputChange = (quantity) => {
        this.setState({quantity: quantity});

        if(quantity && isFinite(quantity) && quantity >= 0){
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
            <Row className="cart-widget__summary__item" key={item.id}>
                <Col xs={3}>
                    <img src={item.image} className="img-fluid"/>
                </Col>
                <Col xs={9}>
                    <Row>
                        <Col sm={12}>
                            <CartItemDescription
                                key={item.id}
                                item={item}
                            />
                        </Col>

                        <TotalLine label="Amount" value={item.price} />

                        <CartItemVariationDescription
                            key={item.id}
                            item={item}
                        />

                        <React.Fragment>
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
                        </React.Fragment>
                    </Row>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const actions = {
    updateItemQuantity: updateItemQuantity
};

export const CartItem = connect(mapStateToProps, actions)(_Item);