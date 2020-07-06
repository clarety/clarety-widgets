import React from 'react';
import { Spinner, Modal } from 'react-bootstrap';

export const BusyOverlay = ({ message }) => (
  <Modal.Dialog className="busy-overlay-modal">
    <Modal.Body>
      <h5>{message}</h5>
      <Spinner animation="border" className="mt-3" />
    </Modal.Body>
  </Modal.Dialog>
);
