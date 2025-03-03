import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Provider store={store}>
    <ConfigProvider theme={{ token: { colorPrimary: "#5d2bff", colorLink: "#5d2bff"} }}>
      <App />
    </ConfigProvider>
  </Provider>
);
