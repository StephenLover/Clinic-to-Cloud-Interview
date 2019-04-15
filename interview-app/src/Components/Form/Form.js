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
      observationName: this.props.formProps.observationName || null,
      optPropsMap: optimisedPropsMap || null
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
    this.setState({
      loading: false
    });
    // console.log(this.state);
  }

  // textInput-Based: Name
  handleTextInput = propertyProps => {
    const { name: properties } = propertyProps;
    const { display, displayName, isRequired } = properties;
    // console.log(properties);

    if (display) {
      return (
        <div>
          <label>
            {displayName}
            <input
              name={displayName.toLowerCase()}
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
        </div>
      );
    }
    // console.log(propertyProps);
  };

  // numberInput-Based: Head Circumference, Height, Weight, BMI
  handleNumberInput = propertyProps => {
    const numberInputPropsArray = this.props.formProps.dataElements.filter(
      property => property.type === "numberInput"
    );
    console.log(numberInputPropsArray);

    let renderContext;
    for (const property in propertyProps) {
      const {
        display,
        displayName,
        isRequired,
        bounds,
        unitOfMeasure
      } = propertyProps[property];
      console.log(display, displayName);
      if (display) {
        renderContext += (
          <div>
            <label>
              {displayName}
              <input value={this.state.property} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </div>
        );
      }
    }
    return renderContext;
  };

  handleSelector = propertyProps => {
    // console.log(propertyProps);
    const { gender: properties } = propertyProps;
    const { display, displayName, isRequired, options } = properties;
    // console.log(options);

    // need to write sort function

    if (display) {
      return (
        <div>
          <label>
            {displayName}
            <select
              name={displayName.toLowerCase()}
              value={this.state.gender}
              onChange={this.handleChange}
            >
              {options.map(gender => {
                return <option value={gender.id}>{gender.name}</option>;
              })}
            </select>
          </label>
        </div>
      );
    }
  };

  handleChange = event => {
    const formName = event.target.name;
    console.log(event.target.value, formName);

    this.setState({
      [formName]: event.target.value
    });
  };

  handleSubmit = event => {
    // console.log(this.state);
    console.log(this.state);
    event.preventDefault();
  };

  render() {
    let context = "loading form...";
    // if (this.state.optPropsMap) {
    //   console.log(this.state.optPropsMap.get("textInput"));
    // }
    // console.log(this.state);
    if (this.state.loading) {
      return context;
    } else {
      console.log(this.state);
      context = (
        <form onSubmit={this.handleSubmit}>
          {/* // textinput */}
          {this.state.optPropsMap.get("textInput")
            ? this.handleTextInput(this.state.optPropsMap.get("textInput"))
            : null}
          {/* {this.handleTextInput(this.state.optPropsMap["textInput"])} */}

          {this.state.optPropsMap.get("select")
            ? this.handleSelector(this.state.optPropsMap.get("select"))
            : null}

          {this.state.optPropsMap.get("numberInput")
            ? this.handleNumberInput(this.state.optPropsMap.get("numberInput"))
            : null}

          <input type="submit" value="Submit" />
        </form>
      );
    }
    return context;
  }
}

export default Form;
