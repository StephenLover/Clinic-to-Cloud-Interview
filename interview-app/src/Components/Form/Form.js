import React, { Component } from "react";
import "./Form.css";

const formPropertiesSeparator = formPropsArray => {
  let optimizedMap = new Map();
  for (let property of formPropsArray) {
    const { id, type, ...restProperties } = property;
    optimizedMap.get(type) === undefined
      ? optimizedMap.set(type, { [id]: restProperties })
      : (optimizedMap.get(type)[id] = restProperties);
  }
  return optimizedMap;
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: null,
      observationName: null,
      error: {}
    };
  }

  async componentDidMount() {
    const optimisedPropsMap = formPropertiesSeparator(
      this.props.formProps.dataElements
    );
    this.setState({
      id: this.props.formProps.id || null,
      observationName: this.props.formProps.observationName || null
    });
    for (let [dataType, dataObj] of optimisedPropsMap) {
      let initialValue;
      for (let data in dataObj) {
        if (dataType === "textInput") {
          initialValue = "";
        } else if (dataType === "numberInput") {
          initialValue = 0;
        } else if (dataType === "select") {
          initialValue = "unselected";
        }
        await this.setState({ [data]: initialValue });
      }
    }
    console.log(this.state);
  }

  // textInput-Based: Name
  handleTextInput = propertyProps => {
    console.log(propertyProps);
  };

  // numberInput-Based: Head Circumference, Height, Weight, BMI
  handleTextNumberInput = propertyProps => {
    console.log(propertyProps);
    if (propertyProps) {
      const {
        displayName,
        display,
        isRequired,
        validate,
        type,
        bounds,
        unitOfMeasure
      } = propertyProps;
      // console.log(
      //   displayName,
      //   display,
      //   isRequired,
      //   validate,
      //   type,
      //   bounds,
      //   unitOfMeasure
      // );
      if (display) {
        return (
          <div>
            <label>
              {displayName}
              <input
                name={displayName.toLowerCase()}
                type="text"
                value={this.state.displayName}
                onChange={this.hasssndleChange}
              />
            </label>
            {unitOfMeasure}
          </div>
        );
      }
    }
  };

  handleSelector = propertyProps => {
    //     const nameConstraint = propertyProps;
    // console.log(propertyProps);
  };

  handleChange = event => {
    const formName = event.target.name;
    console.log(event.target.value);

    this.setState({
      [`${formName}Input`]: event.target.value
    });
  };

  handleSubmit = event => {
    // console.log(this.state);
    alert("Your favorite flavor is: " + this.state.value);
    event.preventDefault();
  };

  render() {
    let context = "loading form...";

    if (this.state.loading) {
      return context;
    } else {
      let formPropsMap = new Map();
      for (let prop of this.props.formProps.dataElements) {
        const { id, ...restProperties } = prop;
        formPropsMap.set(id, restProperties);
      }
      // console.log(formPropsMap);
      const propRenderDecider = (value, key, map) => {
        // console.log(`m[${key}] = ${value.type}`);
        if (
          key &&
          (value.type === "textInput" || value.type === "numberInput")
        ) {
          // console.log(this.handleTextNumberInput(formPropsMap.get(key)));
          return this.handleTextNumberInput(formPropsMap.get(key));
        } else if (key && value.type === "select") {
          // console.log(this.handleSelector(formPropsMap.get(key)));
          return this.handleSelector(formPropsMap.get(key));
        }
      };

      // console.log(formPropsMap);
      context = (
        <form onSubmit={this.handleSubmit}>
          {formPropsMap.forEach(propRenderDecider)}
          <input type="submit" value="Submit" />
        </form>
      );
    }
    return context;
  }
}

export default Form;
