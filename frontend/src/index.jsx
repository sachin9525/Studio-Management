import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "@/store";
import App from "./App.jsx";
import ErrorBoundary from "@/components/common/ErrorBoundary.jsx";
import GlobalToast from "@/components/common/GlobalToast.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
        <GlobalToast />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
