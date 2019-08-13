import React from 'react';
import {connect} from "react-redux";
import { QtyInput } from "cart/components";
import { updateSalelineQuantity } from "../actions";

class _Saleline extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            saleline: this.props.saleline,
            isBusy: this.props.isBusy
        };
    }

    componentDidUpdate(prevProps, prevState) {
        //TODO wait a moment before checking to check the user is complete.
        //set a variable to map the timer, if the variable exists, remove it and start the timer again.

        if (this.state.saleline.quantity !== prevState.saleline.quantity) {
            updateSalelineQuantity();
        }
    }

    render() {
        const { isBusy, saleline } = this.state;
        return (
            <div className={`${isBusy?'busy-processing':''}`}>
                <p>{saleline.description}</p>
                <QtyInput
                    value={saleline.quantity || 0}
                    onChange={qty =>
                        this.setState(prevState => {
                            let saleline = Object.assign({}, prevState.saleline);
                            saleline.quantity = qty;
                            return { saleline };
                        }
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};
const actions = {};
export const Saleline = connect(mapStateToProps, actions)(_Saleline);