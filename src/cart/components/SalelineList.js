import React from 'react';
import {connect} from "react-redux";
import { Saleline } from "cart/components";

class _SalelineList extends React.Component {
    render() {
        const { cart, busySalelines } = this.props;
        if (!cart || !cart.lines) return null;

        return (
            <div>
                {cart.lines.map(saleline =>
                    <Saleline
                        saleline={saleline}
                        key={saleline.id}
                        isBusy={!!busySalelines.find(busySaleline => busySaleline.id === saleline.id)}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cart: state.cart,
        busySalelines: state.busySalelines
    };
};

const actions = {};
export const SalelineList = connect(mapStateToProps, actions)(_SalelineList);