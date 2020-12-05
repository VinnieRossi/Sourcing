import React from 'react';
import AzureAD from 'react-aad-msal';
import ReactDOM from 'react-dom';
import App from './App';
import { authProvider } from './auth/AuthProvider';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    {/* <AzureAD provider={authProvider} forceLogin={true}> */}
    <App />
    {/* </AzureAD> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
