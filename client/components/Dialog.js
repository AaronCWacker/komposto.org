import React, { Component } from 'react';

import styles from './Dialog.module.css';

export default function Dialog({ children, title }) {
  return (
    <div className={ styles.dialog }>
      <div className={ styles.inner }>
        <h3>{ title }</h3>
        { children }
      </div>
    </div>
  );
}
