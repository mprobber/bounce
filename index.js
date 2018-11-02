// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';

const rootNode = document.getElementById('root');
if (rootNode) {
  ReactDOM.render(<Root />, rootNode);
} else {
  throw new Error('Could not find root dom node');
}
