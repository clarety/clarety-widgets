import React from 'react';
import { Col } from 'react-bootstrap';
import { currency } from 'shared/utils';


export const TotalLine = ({ label, value, fallback }) => {
    if (!value && !fallback) return null;

    const displayValue = value ? currency(value) : fallback;

    return (
        <React.Fragment>
            <Col xs={6} as="dt">{label}</Col>
            <Col xs={6} as="dd" className="text-right">{displayValue}</Col>
        </React.Fragment>
    );
};
