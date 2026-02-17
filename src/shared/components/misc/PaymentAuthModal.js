import React from 'react';
import { Modal } from 'react-bootstrap';

export function PaymentAuthModal({ url, onCancel }) {
  return (
    <Modal show={!!url} size="md" centered>
      <a
        href="#"
        onClick={onCancel ? (event) => {
          event.preventDefault();
          onCancel();
        } : undefined}
        style={{ position: 'absolute', right: 4, top: -26, color: 'white', textDecoration: 'none' }}
      >
        CANCEL
      </a>

      <iframe
        src={url}
        style={{ margin: 0, padding: 0, border: 0, width: '100%', height: 800 }}
      />
    </Modal>
  );
}
