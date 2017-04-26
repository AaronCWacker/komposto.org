import React, { Component } from 'react';

import Dialog from './Dialog';

export default function EditDialog({
  sketch,
  onChange,
  onSubmit,
}) {
  return (
    <Dialog title="Update Sketch">
      <form onSubmit={ onSubmit }>
        <p>
          <label>Title</label>
          <input value={ sketch.title } onChange={ onChange('title') } />
        </p>
        <p>
          <label>Description</label>
          <textarea
            defaultValue={ sketch.description }
            onChange={ onChange('description') }
            rows={ 3 } />
        </p>
        <input type="submit" value={"Continue"} />
      </form>
    </Dialog>
  );
}
