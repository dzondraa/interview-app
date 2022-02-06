import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing"

Sentry.init({
  dsn: "https://29ae3ac11436440db2f45e3cd9b2bb56@o1137007.ingest.sentry.io/6189134",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


