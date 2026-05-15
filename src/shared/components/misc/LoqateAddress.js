import React, { forwardRef } from 'react';
import AddressSearch from 'react-loqate';

export function LoqateInput({ label, name, error, containerStyle, apiKey, value, addressType, onSelect, placeholder, country, onChange }) {
    return (
        <div style={containerStyle}>
            <AddressSearch
                locale="en-AU"
                apiKey={apiKey}
                countries={[country]}
                limit={10}
                onSelect={(address) => onSelect(transformLoqateAddress(address, country))}
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
    return {
        address1: selectedAddress.Line1,
        address2: selectedAddress.Line2,
        address3: selectedAddress.Line3 || selectedAddress.BuildingName,
        suburb: selectedAddress.City,
        state: selectedAddress.ProvinceName,
        postcode: selectedAddress.PostalCode,
        country: selectedAddress.CountryIso2,
        dpid: selectedAddress.DomesticId,

        // display text shown in the autosuggest field.
        fieldText: selectedAddress.Label,
    }
}
