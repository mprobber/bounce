// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';

const rootNode = document.createElement('div');
if (document.body) {
  document.body.appendChild(rootNode);
}

rootNode.style.setProperty('height', '100%');
ReactDOM.render(<Root />, rootNode);
