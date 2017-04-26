import React, { Component } from 'react';

import { messages } from '../constants';
import { 
  fetchSketch, updateSketch, forkSketch,
  fetchHelpDocument
} from '../networking';
import styles from './SketchDetail.module.css';
import EditDialog from '../components/EditDialog';
import ForkDialog from '../components/ForkDialog';
import HelpDialog from '../components/HelpDialog';

export default class AppContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSaveDialog: false,
      showForkDialog: false,
      showHelp: false,
      helpDocument: null,
      sketch: {},
    };

    this.messageHandlers = {
      [messages.UPDATE_LINES]: this.showSaveDialog.bind(this),
      [messages.FORK_SKETCH]: this.showForkDialog.bind(this),
      [messages.TOGGLE_HELP]: this.toggleHelp.bind(this),
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleForkSubmit = this.handleForkSubmit.bind(this);
    this.handleSketchResponse = this.handleSketchResponse.bind(this);
    this.handleHelpDocument = this.handleHelpDocument.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
    fetchSketch(this.props.sketchId, this.handleSketchResponse);
    fetchHelpDocument(this.handleHelpDocument)
  }

  handleSketchResponse(sketch) {
    this.setState({ sketch });
  }

  handleHelpDocument(helpDocument) {
    this.setState({ helpDocument });
  }

  toggleHelp() {
    this.setState({
      showHelp: !this.state.showHelp,
    });
  }

  showSaveDialog({ lines, snapshot }) {
    this.setState({
      showSaveDialog: true,
      buffer: {
        ...this.state.sketch,
        content: lines,
        snapshot,
      },
    });
  }

  showForkDialog({ lines, snapshot }) {
    this.setState({
      showForkDialog: true,
      buffer: {
        ...this.state.sketch,
        content: lines,
        snapshot,
      },
    });
  }

  handleMessage(event) {
    const { message, ...payload } = JSON.parse(event.data);
    this.messageHandlers[message].call(this, payload);
  }

  handleChange(key) {
    return event => {
      this.setState({
        buffer: {
          ...this.state.buffer,
          [key]: event.target.value,
        },
      });
    };
  }

  handleSubmit(event) {
    const { description, title, content, snapshot } = this.state.buffer;

    event.preventDefault();

    updateSketch(
      this.props.sketchId,
      {
        description,
        title,
        content,
        snapshot
      },
      () => {
        this.setState({
          sketch: this.state.buffer,
          showSaveDialog: false,
        });
      },
      () => {
        alert('An error occurred.');
      }
    );
  }

  handleForkSubmit(event) {
    const { description, title, content, snapshot } = this.state.buffer;

    event.preventDefault();

    forkSketch(
      this.props.sketchId,
      {
        description,
        title,
        content,
        snapshot
      },
      (response) => {
        window.location.href = response.absolute_url;
      },
      () => {
        alert('An error occurred.');
      }
    );
  }

  render() {
    const {
      buffer, showSaveDialog, showForkDialog, showHelp,
      helpDocument
    } = this.state;
    return (
      <div>
        { showSaveDialog && (
          <EditDialog sketch={ buffer }
            onChange={ this.handleChange }
            onSubmit={ this.handleSubmit }
          />
        )}
        { showForkDialog && (
          <ForkDialog sketch={ buffer }
            onChange={ this.handleChange }
            onSubmit={ this.handleForkSubmit }
          />
        )}
        { showHelp && (
          <HelpDialog content={ helpDocument } />
        )}
        <iframe
          ref={ ref => this.iframeRef = ref }
          className={ styles.canvasIframe }
          sandbox="allow-scripts"
          src={ this.props.sandboxUrl }
        />
      </div>
    );
  }
}
