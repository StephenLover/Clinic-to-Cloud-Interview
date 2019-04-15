import React, { Component } from "react";
import "./Form.css";

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
    this.setState({
      id: this.props.formProps.id || null,
      observationName: this.props.formProps.observationName || null
    });
    const props = this.props.formProps.dataElements;
    console.log(this.props.formProps.dataElements);
    for (let prop of props) {
      let initialValue;
      if (prop.type === "textInput") {
        initialValue = "";
      } else if (prop.type === "numberInput") {
        initialValue = 0;
      } else if (prop.type === "select") {
        initialValue = 1;
      }
      await this.setState({ [prop.id]: initialValue });
    }
    this.setState({
      loading: false
    });
    // console.log(this.state);
  }

  // textInput-Based: Name
  handleTextInput = textPropertyProps => {
    let renderContext = null;
    if (textPropertyProps) {
      renderContext = textPropertyProps.map(singleForm => {
        const { id, display, displayName, isRequired } = singleForm;
        if (display) {
          return (
            <div className={id}>
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
      });
    }
    return renderContext;
  };

  // numberInput-Based: Head Circumference, Height, Weight, BMI
  handleNumberInput = numberPropertyProps => {
    console.log(numberPropertyProps);
    let renderContext = null;
    if (numberPropertyProps) {
      renderContext = numberPropertyProps.map(singleForm => {
        const {
          id,
          display,
          displayName,
          isRequired,
          unitOfMeasure,
          type
        } = singleForm;
        if (display) {
          return (
            <div className={id}>
              <label>
                {displayName}
                <input
                  name={displayName.toLowerCase()}
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />{" "}
                {unitOfMeasure}
              </label>
            </div>
          );
        }
        return null;
      });
    }
    return renderContext;
  };

  handleSelectorInput = selectorPropertyProps => {
    console.log(selectorPropertyProps);
    let renderContext = null;
    if (selectorPropertyProps) {
      renderContext = selectorPropertyProps.map(singleForm => {
        const { id, display, displayName, isRequire, options } = singleForm;
        if (display) {
          return (
            <div id={id}>
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
        return null;
      });
    }
    return renderContext;
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

    if (this.state.loading) {
      return context;
    } else {
      const props = this.props.formProps.dataElements;
      const textInputPropsArray = props.filter(
        prop => prop.type === "textInput"
      );
      const selectorPropsArray = props.filter(prop => prop.type === "select");
      const numberInputPropsArray = props.filter(
        prop => prop.type === "numberInput"
      );
      console.log(this.state);
      context = (
        <form onSubmit={this.handleSubmit}>
          {/* // textinput */}

          {textInputPropsArray
            ? this.handleTextInput(textInputPropsArray)
            : null}

          {selectorPropsArray
            ? this.handleSelectorInput(selectorPropsArray)
            : null}

          {numberInputPropsArray
            ? this.handleNumberInput(numberInputPropsArray)
            : null}
          <input type="submit" value="Submit" />
        </form>
      );
    }
    return context;
  }
}

export default Form;
