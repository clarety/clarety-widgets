import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Spinner, Modal } from 'react-bootstrap';

export const BusyOverlay = ({ messageId }) => (
  <Modal.Dialog>
    <Modal.Body>
      <FormattedMessage id={messageId} tagName="h5" />
      <Spinner animation="border" className="mt-3" />
    </Modal.Body>
  </Modal.Dialog>
);
