import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login";
import Directories from "./pages/Directories";
import Main from "./pages/Main";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/directories" exact component={Directories} />
      <Route path="/directories/:directory" component={Main} />
    </BrowserRouter>
  );
}
