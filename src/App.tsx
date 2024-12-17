import { Fragment } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import useDebugRender from "tilg";
import { Toaster } from "@/components/UI/toaster";
import "@fontsource/nunito";
import { Provider } from "react-redux";
import { store } from "./store";

export default function App() {
  useDebugRender();

  return (
    <div className="font-nunito">
      <Fragment>
        <Provider store={store}>
          <Toaster />
          <Outlet />
          <ScrollRestoration />
        </Provider>
      </Fragment>
    </div>
  );
}
