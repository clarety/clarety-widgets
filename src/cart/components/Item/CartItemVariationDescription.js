import React from 'react';
import { Row, Col } from "react-bootstrap";

export const CartItemVariationDescription = ({ item }) => {
    if (!item || !item.variantDetails) return null;

    return (
        <Col sm={12}>
            {item.variantDetails.map((variant, index) =>
                <React.Fragment key={index}>
                    <Row>
                    <Col as="dt" xs={6}>
                        {variant.label}
                    </Col>
                    <Col as="dd" xs={6} className="text-right">
                        {variant.value}
                    </Col>
                    </Row>
                </React.Fragment>
            )}
        </Col>
    );
};
