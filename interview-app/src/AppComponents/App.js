import React, { Component } from "react";
import "./App.css";
import {
  bmiReferenceProps,
  headCircumferenceReferenceProps
} from "../FakeJson/DummyData";

import Form from "../Components/Form/Form";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Form formProps={bmiReferenceProps} />
      </div>
    );
  }
}

export default App;
