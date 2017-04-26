import React, { Component } from 'react';

import styles from './HelpDialog.module.css';

export default function HelpDialog({
  content
}) {
  return (
    <div
      className={ styles.helpDialog }
      dangerouslySetInnerHTML={{
        __html: content
      }}
    />
  );
}
