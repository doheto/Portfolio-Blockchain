import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './_store';
import { App } from './App';
import "antd/dist/antd.css";
import "./index.css";
import registerServiceWorker from './registerServiceWorker';


ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
registerServiceWorker();