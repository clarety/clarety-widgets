export async function setupAddressFinder({ elementId, apiKey, country, onLoad, onSelect }) {
  await loadScript();

  const element = document.getElementById(elementId);

  const options = {
    show_locations: false,
    address_params: {
      au_paf: '1',
    },
  };

  const addressFinder = new AddressFinder.Widget(element, apiKey, country, options);

  if (onLoad) onLoad(addressFinder);

  if (onSelect) {
    addressFinder.on('result:select', (fullAddress, metaData) => {
      onSelectHandler(fullAddress, metaData, country, onSelect);
    });
  }
}

let loadScriptPromise = null;

function loadScript() {
  if (!loadScriptPromise) {
    loadScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  return loadScriptPromise;
}

function onSelectHandler(fullAddress, metaData, country, onSelect) {
  if (country === 'AU') {
    onSelect({
      address1: metaData.address_line_1,
      address2: metaData.address_line_2,
      suburb:   metaData.locality_name,
      state:    metaData.state_territory,
      postcode: metaData.postcode,
      country:  'AU',
      dpid:     metaData.dpid,
    });
  }

  if (country === 'NZ') {
    const selected = new AddressFinder.NZSelectedAddress(fullAddress, metaData);

    onSelect({
      address1: selected.address_line_1(),
      address2: selected.address_line_2(),
      suburb:   selected.suburb(),
      state:    selected.city(),
      postcode: selected.postcode(),
      country:  'NZ',
      dpid:     metaData.dpid,
    });
  }
}
