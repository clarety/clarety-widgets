import { LoginPanel } from 'shared/components';
import { CustomerPanel, AddressPanel, ShippingPanel, CheckoutPaymentPanel } from 'checkout/components';
import { CheckoutLoginConnect } from 'checkout/components';
import { ModePanel, EventPanel, QtysPanel, RegistrationOffersPanel, DetailsPanel, TeamPanel, DonatePanel, ReviewPanel, ValidatePanel, RegistrationPaymentPanel } from 'registration/components';
import { RegistrationLoginConnect } from 'registration/components';
import { LeadGenCustomerPanel } from 'lead-gen/components';

export class Resources {
  static getComponent(component, context = {}) {
    if (context[component]) {
      return context[component];
    }

    switch (component) {
      // Shared panels
      case 'LoginPanel':               return LoginPanel;

      // Checkout panels
      case 'CustomerPanel':            return CustomerPanel;
      case 'AddressPanel':             return AddressPanel;
      case 'ShippingPanel':            return ShippingPanel;
      case 'PaymentPanel':             return PaymentPanel;
      case 'CheckoutPaymentPanel':     return CheckoutPaymentPanel;

      // Registration panels
      case 'ModePanel':                return ModePanel;
      case 'EventPanel':               return EventPanel;
      case 'QtysPanel':                return QtysPanel;
      case 'RegistrationOffersPanel':  return RegistrationOffersPanel;
      case 'DetailsPanel':             return DetailsPanel;
      case 'TeamPanel':                return TeamPanel;
      case 'DonatePanel':              return DonatePanel;
      case 'ReviewPanel':              return ReviewPanel;
      case 'ValidatePanel':            return ValidatePanel;
      case 'RegistrationPaymentPanel': return RegistrationPaymentPanel;

      // Lead gen panels
      case 'LeadGenCustomerPanel':     return LeadGenCustomerPanel;

      // Default
      default: throw new Error(`Cannot resolve component ${component}`);
    }
  }

  static getConnect(connect) {
    switch (connect) {
      // Checkout connect
      case 'CheckoutLoginConnect':     return CheckoutLoginConnect;

      // Registration connect
      case 'RegistrationLoginConnect': return RegistrationLoginConnect;

      // Default
      default: throw new Error(`Cannot resolve connect ${connect}`);
    }
  }
}
