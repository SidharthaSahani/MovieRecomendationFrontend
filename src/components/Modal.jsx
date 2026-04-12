import React from 'react';
import { styles } from '../styles/styles';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default Modal;