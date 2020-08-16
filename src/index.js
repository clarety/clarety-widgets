import 'core-js/stable';
import 'custom-event-polyfill';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export { Config } from 'clarety-utils';
export { connect } from 'react-redux';

export { renderWidget, getElementOptions, getSitePath, loadCss } from 'shared/utils';

export { DonateWidget } from 'donate/components';
export { setupDonateAxiosMock } from 'donate/mocks';

export { Registration } from 'registration/components';
export { setupRegistrationAxiosMock } from 'registration/mocks';

export { Checkout } from 'checkout/components';
export { setupCheckoutAxiosMock } from 'checkout/mocks';

export { Cart } from 'cart/components';
export { setupCartAxiosMock } from 'cart/mocks';

export { LeadGenWidget } from 'lead-gen/components';

export { SubscribeWidget } from 'subscribe/components';
export { setupSubscribeAxiosMock } from 'subscribe/mocks';

export { FundraisingStart } from 'fundraising-start/components';

export { QuizWidget } from 'quiz/components';
export { setupQuizAxiosMock } from 'quiz/mocks';

export { FileUploadWidget } from 'file-upload/components';

export { RsvpWidget } from 'rsvp/components';
