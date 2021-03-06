import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { QtyInput, TotalLine, CartItemDescription, CartItemVariationDescription } from 'cart/components';
import { updateItemQuantity } from 'cart/actions';

class _CartItem extends React.Component {
    timeout = null;
    updateDelay = 250;

    constructor(props) {
        super(props);

        this.state = {
            quantity: props.item.quantity,
        };
    }

    componentDidUpdate(prevProps) {
        const { item } = this.props;

        if (item.quantity !== prevProps.item.quantity) {
            this.setState({ quantity: item.quantity });
        }
    }

    onInputChange = (text) => {
        const quantity = text ? Number(text) : '';

        this.setState({ quantity });

        if (quantity !== '') {
            this.onQuantityChange(quantity);
        }
    };

    onQuantityChange = (quantity) => {
        const { updateItemQuantity, item } = this.props;

        this.setState({ quantity });

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => updateItemQuantity(item, quantity), this.updateDelay);
    };

    onPressRemove = (event) => {
        event.preventDefault();

        const { updateItemQuantity, item } = this.props;
        updateItemQuantity(item, 0);
    };

    render() {
        const { item } = this.props;

        return (
            <div className="cart-widget__summary__item">
                <Row>
                    <Col xs={3}>
                        <img src={item.image} className="img-fluid"/>
                    </Col>
                    <Col xs={9}>
                        <CartItemDescription item={item} />

                        <Row>
                            <TotalLine label={t('amount', 'Amount')} value={item.price} />
                            <CartItemVariationDescription item={item} />

                            {this.renderQty()}

                            <Col className="text-right">
                                <a href="#" onClick={this.onPressRemove}>{t('remove', 'Remove')}</a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }

    renderQty() {
        if (this.props.item.variablePrice) return null;

        return (
            <React.Fragment>
                <Col as="dt" xs={6}>{t('quantity', 'Quantity')}</Col>
                <Col as="dd" xs={6} className="text-right">
                    <QtyInput
                        value={this.state.quantity}
                        onChange={this.onQuantityChange}
                        onInputChange={this.onInputChange}
                    />
                </Col>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {};
};

const actions = { updateItemQuantity };

export const CartItem = connect(mapStateToProps, actions)(_CartItem);
