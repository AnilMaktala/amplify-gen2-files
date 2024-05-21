import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
Amplify.configure(outputs);

Amplify.configure({
  ...Amplify.getConfig(),
  Interactions: {
    LexV2: {
      amplifySample: {
        aliasId: "WMRFZWDSDQ",
        botId: "Z4O8BIX4J6",
        localeId: "en_US",
        region: "us-east-1",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
