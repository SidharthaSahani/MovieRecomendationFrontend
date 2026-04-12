import React from 'react';
import { styles } from '../styles/styles';

function LoadingState({ message = 'Loading...' }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>⏳</div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;