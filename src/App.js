import React, { Component } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly.css";
import "patternfly/dist/css/patternfly.css";
import "patternfly/dist/css/patternfly-additions.css";
import "patternfly-react/dist/css/patternfly-react.css";

import "./App.css";
import PageLayoutDefaultNav from "./layout";

class App extends Component {
  state = {};

  render() {
    return (
      <div className="App">
        <PageLayoutDefaultNav />
      </div>
    );
  }
}

export default App;
