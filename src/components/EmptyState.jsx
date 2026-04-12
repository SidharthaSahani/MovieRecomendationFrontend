import React from 'react';
import { styles } from '../styles/styles';

function EmptyState({ icon = '', message = 'No items found.' }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>{icon}</div>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;