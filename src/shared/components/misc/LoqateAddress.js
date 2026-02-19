import React, { forwardRef } from 'react';
import AddressSearch from 'react-loqate';
import 'react-loqate/dist/index.css';
import { Form } from 'react-bootstrap';


export function LoqateInput({ label, name, error, containerStyle, apiKey, value, addressType, onPlaceSelect, placeholder, country, onChange }) {
    return (
        <div style={containerStyle}>
            <AddressSearch
                locale="en-AU"
                apiKey={apiKey}
                countries={[country]}
                limit={10}
                onSelect={(address) => onPlaceSelect(transformLoqateAddress(address, country))}
                components={{
                    Input: forwardRef((props, ref) => (
                        <input
                            {...props} 
                            ref={ref}
                            name={name}
                            placeholder={placeholder}
                            value={value} 
                            className="form-control"
                            onChange={(e) => {
                                props.onChange(e);
                                if (onChange) onChange(e.target.value, addressType);
                            }}
                        />
                    )),
                   
                    ListItem: ({ suggestion, ...rest }) => (
                        <li
                        style={{cursor: 'pointer', padding: '7px 5px', borderBottom: '0.5px solid #CCCCCC'}}
                            class='react-loqate-list-item-custom'
                            onClick={(e) => onChange(e.target.value)}
                            {...rest}
                        >
                            {suggestion.Text} <b>{suggestion.Description}</b>
                        </li>
                    ),
                }}
            />
        </div>
    );
}


function transformLoqateAddress(selectedAddress, country) {
    const address = {};
    
    address.address1 = selectedAddress.Line1;
    address.address2 = selectedAddress.Line2;
    address.address3 = selectedAddress.Line3;
    address.suburb = selectedAddress.City;
    address.state = selectedAddress.Province
    address.postcode = selectedAddress.PostalCode
    address.country = selectedAddress.CountryIso2
    address.dpid = selectedAddress.DomesticId
               
    address.fieldText = selectedAddress.Label
    return address;
}
