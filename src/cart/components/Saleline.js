import React from 'react';
import { connect } from "react-redux";
import { QtyInput } from "cart/components";
import { updateSalelineQuantity } from "../actions";
import { currency } from "shared/utils";

class _Saleline extends React.Component {
    timeout = null;
    time = 500;

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.saleline.quantity,
        };
    }

    onQuantityChange = (quantity) => {
        const { updateSalelineQuantity, saleline } = this.props;

        this.setState({quantity: quantity});
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => updateSalelineQuantity(saleline, quantity), this.time);
    }

    componentDidUpdate(prevProps, prevState) {
        const { saleline } = this.props;

        if(saleline.quantity !== prevProps.saleline.quantity){
            this.setState({quantity:saleline.quantity});
        }
    }

    render() {
        const { saleline, isBusy } = this.props;
        const { quantity } = this.state;

        return (
            <div className={`${isBusy?'busy-processing':''}`}>
                <p>##Image##</p>
                <p>{saleline.description}</p>
                <p>Amount ##Amount##</p>
                <p>Size ##Size##</p>
                <p>Quantity
                <QtyInput
                    value={quantity || 0}
                    onChange={ this.onQuantityChange }
                />
                </p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const actions = {
    updateSalelineQuantity: updateSalelineQuantity
};

export const Saleline = connect(mapStateToProps, actions)(_Saleline);