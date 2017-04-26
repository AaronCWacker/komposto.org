import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Layout from '../components/Layout';
import Canvas from '../components/Canvas';
import Editor from '../components/Editor';

import { messages } from '../constants';
import { parse } from '../parser';

export default class SandboxContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      lines: [],
      running: true,
    };

    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onInputKeyUp = this.onInputKeyUp.bind(this);
    this.updateLines = this.updateLines.bind(this);

    this.externalCalls = {
      '/save': this.save.bind(this),
      '/fork': this.fork.bind(this),
      '/undo': this.undo.bind(this),
      '/help': this.help.bind(this),
      '/run': this.run.bind(this),
      '/pause': this.pause.bind(this),
    };
  }

  componentDidMount() {
    this.inputRef.focus();

    this.setState({
      lines: window.__INITIAL_DATA__.content || []
    });
  }

  onInputKeyDown(event) {
    const { lines } = this.state;
    const { value } = event.target;

    if (event.key === 'Enter') {
      if (value in this.externalCalls) {
        this.externalCalls[value]();
      } else {
        this.setState({
          lines: parse(lines, value)
        });
      }
      event.target.value = null;
    }
  }

  getLineByNo(no) {
    const { lines } = this.state;
    return lines[lines.length - no];
  }

  onInputKeyUp(event) {
    const { value } = event.target;
    if (
      value.slice(0, 1) === '/' &&
      event.key !== 'Backspace'
    ) {
      const parts = value.split(' ');
      if (
        parts.length === 2 &&
        parts[1].length === 0
      ) {
        const number = parts[0].slice(1);
        const line = this.getLineByNo(number);
        const code = line || '';
        const position = value.indexOf(' ') + 1;
        event.target.value = `/${number} ${code}`;
        event.target.setSelectionRange(
          position,
          position + code.length
        );
      }
    }
  }

  postMessage(message) {
    parent.postMessage(JSON.stringify(message), '*');
  }

  save() {
    this.postMessage({
      message: messages.UPDATE_LINES,
      lines: this.state.lines,
      snapshot: this.canvasRef.takeSnapshot()
    });
  }

  fork() {
    this.postMessage({
      message: messages.FORK_SKETCH,
      lines: this.state.lines,
      snapshot: this.canvasRef.takeSnapshot()
    });
  }

  updateLines(lines) {
    this.setState({ lines });
  }

  undo() {
    const { lines } = this.state;

    this.setState({
      lines: lines.slice(1),
    });
  }

  pause() {
    this.setState({
      running: false,
    });
  }

  run() {
    this.setState({
      running: true,
    });
  }

  help() {
    this.postMessage({
      message: messages.TOGGLE_HELP,
    });
  }

  render() {
    const { lines } = this.state;

    return (
      <Layout>
        <Canvas
          lines={ lines }
          updateLines={ this.updateLines }
          running={ this.state.running }
          ref={ ref => this.canvasRef = ref }
        />
        <Editor
          lines={ lines }
          onInputKeyDown={ this.onInputKeyDown }
          onInputKeyUp={ this.onInputKeyUp }
          inputRef={ ref => this.inputRef = ref }
        />
      </Layout>
    );
  }
}
