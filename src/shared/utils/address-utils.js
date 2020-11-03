import { t } from 'shared/translations';

export function loadAddressFinder(onLoadCallback) {
  const script = document.createElement('script');
  script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
  script.async = true;
  script.onload = onLoadCallback;
  document.body.appendChild(script);
}

export function getCountryOptions(region) {
  if (region === 'AU-NZ') {
    return [
      { value: 'AU', label: 'Australia' },
      { value: 'NZ', label: 'New Zealand' },
    ];
  }

  return allCountryOptions;
}

export function getStateOptions(country) {
  switch (country) {
    case 'AU': return auStateOptions;
    case 'UK': return ukStateOptions;
    case 'US': return usStateOptions;
    default:   return undefined;
  }
};

export function getSuburbLabel(country) {
  switch (country) {
    case 'AU': return t('suburb');
    case 'NZ': return t('suburb');
    default:   return t(['label.customer.address.suburb', 'suburb']);
  }
}

export function getStateLabel(country) {
  switch (country) {
    case 'UK': return t(['region', 'state']);
    case 'NZ': return t(['city', 'state']);
    default:   return t(['label.customer.address.state', 'state']);
  }
}

export function getPostcodeLabel(country) {
  switch (country) {
    case 'AU': return t('postcode');
    case 'NZ': return t('postcode');
    case 'UK': return t('postcode');
    case 'US': return t(['zipcode', 'postcode']);
    default:   return t(['label.customer.address.postcode', 'postcode']);
  }
}

const auStateOptions = [
  { value: 'NSW', label: 'NSW' },
  { value: 'VIC', label: 'VIC' },
  { value: 'QLD', label: 'QLD' },
  { value: 'SA',  label: 'SA'  },
  { value: 'WA',  label: 'WA'  },
  { value: 'TAS', label: 'TAS' },
  { value: 'NT',  label: 'NT'  },
  { value: 'ACT', label: 'ACT' },
];

const ukStateOptions = [
  { value: 'UK', label: 'UK' },
  { value: 'England', label: 'England' },
  { value: 'Channel Islands', label: 'Channel Islands' },
  { value: 'Isle of Man', label: 'Isle of Man' },
  { value: 'Isle of Wight', label: 'Isle of Wight' },
  { value: 'Isles of Scilly', label: 'Isles of Scilly' },
  { value: 'Northern Ireland', label: 'Northern Ireland' },
  { value: 'Scotland', label: 'Scotland' },
  { value: 'UK-Aberdeen', label: 'UK-Aberdeen' },
];

const usStateOptions = [
  { value:'AL', label: 'Alabama' },
  { value:'AK', label: 'Alaska' },
  { value:'AZ', label: 'Arizona' },
  { value:'AR', label: 'Arkansas' },
  { value:'CA', label: 'California' },
  { value:'CO', label: 'Colorado' },
  { value:'CT', label: 'Connecticut' },
  { value:'DE', label: 'Delaware' },
  { value:'DC', label: 'District of Columbia' },
  { value:'FL', label: 'Florida' },
  { value:'GA', label: 'Georgia' },
  { value:'HI', label: 'Hawaii' },
  { value:'ID', label: 'Idaho' },
  { value:'IL', label: 'Illinois' },
  { value:'IN', label: 'Indiana' },
  { value:'IA', label: 'Iowa' },
  { value:'KS', label: 'Kansas' },
  { value:'KY', label: 'Kentucky' },
  { value:'LA', label: 'Louisiana' },
  { value:'ME', label: 'Maine' },
  { value:'MD', label: 'Maryland' },
  { value:'MA', label: 'Massachusetts' },
  { value:'MI', label: 'Michigan' },
  { value:'MN', label: 'Minnesota' },
  { value:'MS', label: 'Mississippi' },
  { value:'MO', label: 'Missouri' },
  { value:'MT', label: 'Montana' },
  { value:'NE', label: 'Nebraska' },
  { value:'NV', label: 'Nevada' },
  { value:'NH', label: 'New Hampshire' },
  { value:'NJ', label: 'New Jersey' },
  { value:'NM', label: 'New Mexico' },
  { value:'NY', label: 'New York' },
  { value:'NC', label: 'North Carolina' },
  { value:'ND', label: 'North Dakota' },
  { value:'OH', label: 'Ohio' },
  { value:'OK', label: 'Oklahoma' },
  { value:'OR', label: 'Oregon' },
  { value:'PA', label: 'Pennsylvania' },
  { value:'RI', label: 'Rhode Island' },
  { value:'SC', label: 'South Carolina' },
  { value:'SD', label: 'South Dakota' },
  { value:'TN', label: 'Tennessee' },
  { value:'TX', label: 'Texas' },
  { value:'UT', label: 'Utah' },
  { value:'VT', label: 'Vermont' },
  { value:'VA', label: 'Virginia' },
  { value:'WA', label: 'Washington' },
  { value:'WV', label: 'West Virginia' },
  { value:'WI', label: 'Wisconsin' },
  { value:'WY', label: 'Wyoming' },
];

const allCountryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'AU', label: 'Australia' },
  { value: 'UK', label: 'United Kingdom' },
  { value: '',   label: '———' },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AX', label: 'Aland Islands' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'AD', label: 'Andorra' },
  { value: 'AO', label: 'Angola' },
  { value: 'AI', label: 'Anguilla' },
  { value: 'AQ', label: 'Antarctica' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AW', label: 'Aruba' },
  { value: 'AC', label: 'Ascension Island' },
  { value: 'AT', label: 'Austria' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'BB', label: 'Barbados' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'BY', label: 'Belarus' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BZ', label: 'Belize' },
  { value: 'BJ', label: 'Benin' },
  { value: 'BM', label: 'Bermuda' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'BW', label: 'Botswana' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'BV', label: 'Bouvet Island' },
  { value: 'BR', label: 'Brazil' },
  { value: 'IO', label: 'British Indian Ocean Territory' },
  { value: 'BN', label: 'Brunei Darussalam' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'BI', label: 'Burundi' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'CA', label: 'Canada' },
  { value: 'CV', label: 'Cape Verde' },
  { value: 'KY', label: 'Cayman Islands' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'TD', label: 'Chad' },
  { value: 'CL', label: 'Chile' },
  { value: 'CN', label: 'China' },
  { value: 'CX', label: 'Christmas Island' },
  { value: 'CC', label: 'Cocos (Keeling) Islands' },
  { value: 'CO', label: 'Colombia' },
  { value: 'KM', label: 'Comoros' },
  { value: 'CG', label: 'Congo' },
  { value: 'CD', label: 'Congo, Democratic Republic' },
  { value: 'CK', label: 'Cook Islands' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'CI', label: 'Cote D\'Ivoire (Ivory Coast)' },
  { value: 'HR', label: 'Croatia (Hrvatska)' },
  { value: 'CU', label: 'Cuba' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'CS', label: 'Czechoslovakia (former)' },
  { value: 'DK', label: 'Denmark' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'DM', label: 'Dominica' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'TP', label: 'East Timor' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'EG', label: 'Egypt' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'EE', label: 'Estonia' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'FK', label: 'Falkland Islands (Malvinas)' },
  { value: 'FO', label: 'Faroe Islands' },
  { value: 'FJ', label: 'Fiji' },
  { value: 'FI', label: 'Finland' },
  { value: 'FR', label: 'France' },
  { value: 'FX', label: 'France, Metropolitan' },
  { value: 'GF', label: 'French Guiana' },
  { value: 'PF', label: 'French Polynesia' },
  { value: 'TF', label: 'French Southern Territories' },
  { value: 'MK', label: 'Macedonia' },
  { value: 'GA', label: 'Gabon' },
  { value: 'GM', label: 'Gambia' },
  { value: 'GE', label: 'Georgia' },
  { value: 'DE', label: 'Germany' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GI', label: 'Gibraltar' },
  { value: 'GR', label: 'Greece' },
  { value: 'GL', label: 'Greenland' },
  { value: 'GD', label: 'Grenada' },
  { value: 'GP', label: 'Guadeloupe' },
  { value: 'GU', label: 'Guam' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'GN', label: 'Guinea' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'GY', label: 'Guyana' },
  { value: 'HT', label: 'Haiti' },
  { value: 'HM', label: 'Heard and McDonald Islands' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'HU', label: 'Hungary' },
  { value: 'IS', label: 'Iceland' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IR', label: 'Iran' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IL', label: 'Israel' },
  { value: 'IM', label: 'Isle of Man' },
  { value: 'IT', label: 'Italy' },
  { value: 'JE', label: 'Jersey' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'JP', label: 'Japan' },
  { value: 'JO', label: 'Jordan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'KI', label: 'Kiribati' },
  { value: 'KP', label: 'Korea (North)' },
  { value: 'KR', label: 'Korea (South)' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'LA', label: 'Laos' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'LR', label: 'Liberia' },
  { value: 'LY', label: 'Libya' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MO', label: 'Macau' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MW', label: 'Malawi' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MV', label: 'Maldives' },
  { value: 'ML', label: 'Mali' },
  { value: 'MT', label: 'Malta' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'MQ', label: 'Martinique' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'YT', label: 'Mayotte' },
  { value: 'MX', label: 'Mexico' },
  { value: 'FM', label: 'Micronesia' },
  { value: 'MD', label: 'Moldova' },
  { value: 'MC', label: 'Monaco' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'MS', label: 'Montserrat' },
  { value: 'MA', label: 'Morocco' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'NA', label: 'Namibia' },
  { value: 'NR', label: 'Nauru' },
  { value: 'NP', label: 'Nepal' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'AN', label: 'Netherlands Antilles' },
  { value: 'NT', label: 'Neutral Zone' },
  { value: 'NC', label: 'New Caledonia' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NE', label: 'Niger' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'NU', label: 'Niue' },
  { value: 'NF', label: 'Norfolk Island' },
  { value: 'MP', label: 'Northern Mariana Islands' },
  { value: 'NO', label: 'Norway' },
  { value: 'OM', label: 'Oman' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PW', label: 'Palau' },
  { value: 'PS', label: 'Palestinian Territory, Occupied' },
  { value: 'PA', label: 'Panama' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PN', label: 'Pitcairn' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RE', label: 'Reunion' },
  { value: 'RO', label: 'Romania' },
  { value: 'RU', label: 'Russian Federation' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'GS', label: 'S. Georgia and S. Sandwich Isls.' },
  { value: 'KN', label: 'Saint Kitts and Nevis' },
  { value: 'LC', label: 'Saint Lucia' },
  { value: 'VC', label: 'Saint Vincent & the Grenadines' },
  { value: 'WS', label: 'Samoa' },
  { value: 'SM', label: 'San Marino' },
  { value: 'ST', label: 'Sao Tome and Principe' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SN', label: 'Senegal' },
  { value: 'RS', label: 'Serbia' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'SG', label: 'Singapore' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'SK', label: 'Slovak Republic' },
  { value: 'SB', label: 'Solomon Islands' },
  { value: 'SO', label: 'Somalia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'ES', label: 'Spain' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SH', label: 'St. Helena' },
  { value: 'PM', label: 'St. Pierre and Miquelon' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SR', label: 'Suriname' },
  { value: 'SJ', label: 'Svalbard & Jan Mayen Islands' },
  { value: 'SZ', label: 'Swaziland' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SY', label: 'Syria' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TG', label: 'Togo' },
  { value: 'TK', label: 'Tokelau' },
  { value: 'TO', label: 'Tonga' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'TC', label: 'Turks and Caicos Islands' },
  { value: 'TV', label: 'Tuvalu' },
  { value: 'UG', label: 'Uganda' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'UM', label: 'US Minor Outlying Islands' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'SU', label: 'USSR (former)' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'VU', label: 'Vanuatu' },
  { value: 'VA', label: 'Vatican City State (Holy See)' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Viet Nam' },
  { value: 'VG', label: 'British Virgin Islands' },
  { value: 'VI', label: 'Virgin Islands (U.S.)' },
  { value: 'WF', label: 'Wallis and Futuna Islands' },
  { value: 'EH', label: 'Western Sahara' },
  { value: 'YE', label: 'Yemen' },
  { value: 'YU', label: 'Yugoslavia (former)' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' },
];
