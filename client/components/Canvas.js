import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import styles from './Canvas.module.css';
import * as interpreter from '../interpreter';

export default class Canvas extends Component {
  constructor(props, context) {
    super(props, context);

    this.tick = this.tick.bind(this);
    this.startTimer = this.startTimer.bind(this);

    interpreter.reset(); 
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.running !== nextProps.running &&
      nextProps.running
    ) {
      this.startTimer();
    }
  }

  componentDidMount() {
    const { canvas } = this.refs;
    const { width, height, running } = this.props;
    const context = canvas.getContext('2d');

    context.translate(
      (width / 2),
      (height / 2)
    );

    this.startTimer();
  }

  tick() {
    const { canvas } = this.refs;
    const { lines, updateLines } = this.props;
    const context = canvas.getContext('2d');

    interpreter.step(
      canvas,
      context,
      lines,
      updateLines
    );
  }

  startTimer() {
    requestAnimationFrame(() => {
      if (this.props.running) {
        setTimeout(this.startTimer, this.props.interval)
      };
      this.tick();
    });
  }

  takeSnapshot() {
    const { canvas } = this.refs;
    return canvas.toDataURL().split('base64,')[1];
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        width={ width }
        height={ height }
        className={ styles.canvas }
        ref={ 'canvas' }>
      </canvas>
    );
  }
}

Canvas.defaultProps = {
  width: 640 * 2,
  height: 360 * 2,
  interval: 1
};