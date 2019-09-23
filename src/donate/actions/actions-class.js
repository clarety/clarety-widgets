import { PanelActions, PaymentActions, PagePanelActions } from 'donate/actions';

export class Actions {
  panelActions = new PanelActions();
  paymentActions = new PaymentActions();
}

export class PageActions extends Actions {
  panelActions = new PagePanelActions();
}
