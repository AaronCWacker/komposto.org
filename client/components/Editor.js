import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import styles from './Editor.module.css';

export default function Editor({
  lines,
  onInputKeyDown,
  onInputKeyUp,
  inputRef
}) {
  return (
    <div className={ styles.editor }>
      <ol className={ styles.source } reversed>
        { lines.map(
          (code, index) => (
            <li
              key={ index }
              className={ styles.line }
            ><span>{ code }</span></li>
          )
        ) }
      </ol>
      <div className={ styles.inputArea }>
        <input
          placeholder={ '/help' }
          ref={ inputRef }
          onKeyDown={ onInputKeyDown }
          onKeyUp={ onInputKeyUp }
        />
      </div>
    </div>
  );
}
