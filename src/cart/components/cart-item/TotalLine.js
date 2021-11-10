import React from 'react';
import { Col } from 'react-bootstrap';
import { Currency } from 'shared/components';

export const TotalLine = ({ label, value, fallback }) => {
    if (value === undefined || value === null) {
        return fallback || null;
    }

    return (
        <React.Fragment>
            <Col xs={6} as="dt">{label}</Col>
            <Col xs={6} as="dd" className="text-right"><Currency amount={value} /></Col>
        </React.Fragment>
    );
};
