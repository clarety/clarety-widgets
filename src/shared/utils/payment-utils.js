import { Config } from 'shared/utils/config';

export class PaymentGatewayVersion {
  static major = 1;
  static minor = 0;

  static initFromWidgetProps(widgetProps) {
    if (widgetProps.paymentGatewayVersion) {
      this.set(
        widgetProps.paymentGatewayVersion.major,
        widgetProps.paymentGatewayVersion.minor,
      );
    }
  }

  static set(major, minor) {
    this.major = major;
    this.minor = minor;
  }

  static min(major, minor) {
    if (major < this.major) {
      // we satisfy the minimum major version.
      return true;
    }

    if (major === this.major) {
      // we equal the minimum major version,
      // do we satisfy the minimum minor version?
      return minor <= this.minor;
    }

    return false;
  }
}

export function isCreditCard(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.type === 'card';
  } else {
    return paymentMethod.type === 'gatewaycc';
  }
}

export function isStripe(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.gateway === 'stripe';
  } else {
    return isStripeCard(paymentMethod) || isStripeBecs(paymentMethod) || isStripePaymentForm(paymentMethod);
  }
}

export function isStripeCard(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.gateway === 'stripe' && paymentMethod.type === 'card';
  } else {
    return (paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca') && paymentMethod.type === 'gatewaycc';
  }
}

export function isStripeBecs(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.gateway === 'stripe' && paymentMethod.type === 'becs';
  } else {
    return paymentMethod.gateway === 'stripe-becs';
  }
}

export function isStripePaymentForm(paymentMethod) {
  return paymentMethod.type === 'stripe-payment-form';
}

export function isXendit(paymentMethod) {
  return paymentMethod.gateway === 'xendit';
}

export function isXenditCard(paymentMethod) {
  return paymentMethod.gateway === 'xendit' && paymentMethod.type === 'card';
}

export function isPayPal(paymentMethod) {
  return paymentMethod.gateway === 'paypal';
}

export function isNzDirectDebit(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.type === 'nz-direct-debit';
  } else {
    return paymentMethod.type === 'gatewaydd' && paymentMethod.gateway === 'nz';
  }
}

export function isHkDirectDebit(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.type === 'hk-direct-debit';
  } else {
    return paymentMethod.type === 'gatewaydd' && paymentMethod.gateway === 'hk';
  }
}

export function isCaDirectDebit(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.type === 'ca-direct-debit';
  } else {
    return paymentMethod.type === 'gatewaydd' && paymentMethod.gateway === 'ca';
  }
}

export function isAuDirectDebit(paymentMethod) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.type === 'au-direct-debit';
  } else {
    return paymentMethod.type === 'gatewaydd' && !['nz', 'hk', 'ca'].includes(paymentMethod.gateway);
  }
}

export function isNoPayment(paymentMethod) {
  return paymentMethod.type === 'na';
}

export function isMethodAllowedForFrequency(paymentMethod, frequency) {
  if (PaymentGatewayVersion.min(2, 0)) {
    return paymentMethod.allowedFrequencies.includes(frequency);
  } else {
    if (paymentMethod.singleOnly && frequency !== 'single') {
      return false;
    }

    if (paymentMethod.recurringOnly && frequency !== 'recurring') {
      return false;
    }
    
    return true;
  }
}

export function toCents(dollarAmount) {
  return Math.floor(Number(dollarAmount) * 100);
}

export function splitName(fullName) {
  let firstName = '';
  let lastName = '';

  const nameParts = fullName.split(' ').filter(part => !!part.trim());
  if (nameParts.length === 1) {
    firstName = nameParts[0];
    lastName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else if (nameParts.length > 2) {
    lastName = nameParts.pop();
    firstName = nameParts.join(' ');
  }

  return { firstName, lastName };
}

export function convertCountry(country) {
  // for instances that aren't using valid iso codes
  if (!Config.get('useValidIsoCountryCodes')) {
    if (country === 'GB') return 'UK';
    if (country === 'TL') return 'TP';    
  }

  return country;
}

let loadXenditScriptPromise = null;
export function loadXenditScript() {
  if (!loadXenditScriptPromise) {
    loadXenditScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.xendit.co/cards-session.min.js';
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  return loadXenditScriptPromise;
}
