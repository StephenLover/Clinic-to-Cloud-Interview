import React, { Component } from "react";
import "./Form.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: null,
      observationName: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextNumberInput = this.handleTextNumberInput.bind(this);
    this.handleSelector = this.handleSelector.bind(this);
  }

  async componentDidMount() {
    console.log(this.props.formProps);
    this.setState({
      id: this.props.formProps.id,
      observationName: this.props.formProps.observationName
    });
    for (let data of this.props.formProps.dataElements) {
      const { id, type } = data;
      let initialValue;
      if (type === "textInput") {
        initialValue = "";
      } else if (type === "numberInput") {
        initialValue = 0;
      } else if (type === "select") {
        initialValue = "unselected";
      }
      await this.setState({
        [id]: initialValue
      });
    }
    this.setState({ loading: false });
    console.log(this.state);
  }

  //   textInput/numberInput-Based: Name, Head Circumference, Height, Weight, BMI
  handleTextNumberInput(propertyProps) {
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
      console.log(
        displayName,
        display,
        isRequired,
        validate,
        type,
        bounds,
        unitOfMeasure
      );
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
  }

  handleSelector(propertyProps) {
    //     const nameConstraint = propertyProps;
    console.log(propertyProps);
  }

  handleChange(event) {
    const formName = event.target.name;
    console.log(event.target.value);

    this.setState({
      [`${formName}Input`]: event.target.value
    });
  }

  handleSubmit(event) {
    console.log(this.state);
    alert("Your favorite flavor is: " + this.state.value);
    event.preventDefault();
  }

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
      console.log(formPropsMap);
      const propRenderDecider = (value, key, map) => {
        console.log(`m[${key}] = ${value.type}`);
        if (
          key &&
          (value.type === "textInput" || value.type === "numberInput")
        ) {
          console.log(this.handleTextNumberInput(formPropsMap.get(key)));
          return this.handleTextNumberInput(formPropsMap.get(key));
        } else if (key && value.type === "select") {
          console.log(this.handleSelector(formPropsMap.get(key)));
          return this.handleSelector(formPropsMap.get(key));
        }
      };

      console.log(formPropsMap);
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
