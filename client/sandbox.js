import React from 'react';
import ReactDOM from 'react-dom';

import App from './pages/Sandbox';

const isTrustedOrigin = (
  (({ self, top }) => {
    try {
      return self !== top;
    } catch (e) {
      return true;
    }
  })(window)
);

if (isTrustedOrigin) {
  ReactDOM.render(<App />, document.getElementById('root'));
} else {
  window.location.href = (
    'https://www.youtube.com/watch?v=U0gjwpMb-k8'
  );
}
