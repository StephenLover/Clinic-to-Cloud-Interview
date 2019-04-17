import React, { Component } from "react";
import "./Form.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: null,
      observationName: null,
      validate: {}
    };
  }

  async componentDidMount() {
    this.setState({
      id: this.props.formProps.id || null,
      observationName: this.props.formProps.observationName || null
    });
    const props = this.props.formProps.dataElements;
    for (let prop of props) {
      let initialValue;
      if (prop.type === "textInput") {
        initialValue = "";
      } else if (prop.type === "numberInput") {
        initialValue = -1;
      } else if (prop.type === "select") {
        initialValue = 1;
      }
      await this.setState({
        [prop.id]: initialValue
      });
    }
    const requiredValidateProps = props
      .filter(prop => prop.isRequired === true)
      .reduce((lastValiObj, currentProp) => {
        const { id } = currentProp;
        lastValiObj[id] = {
          validation: false,
          errMsg: ""
        };
        return lastValiObj;
      }, {});
    this.setState({
      loading: false,
      validate: requiredValidateProps
    });
  }

  // textInput-Based: Name
  handleTextInput = textPropertyProps => {
    let renderContext = null;
    if (textPropertyProps) {
      renderContext = textPropertyProps.map(singleForm => {
        const { id, display, displayName } = singleForm;
        const { [id]: propValidationObj } = this.state.validate;
        const { errMessage, validation } = propValidationObj;
        if (display) {
          return (
            <div key={id}>
              <label>
                {" "}
                {displayName}{" "}
                <input
                  name={id}
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />{" "}
              </label>{" "}
              {validation === false && errMessage ? (
                <h6 className="input-error-text"> {errMessage} </h6>
              ) : null}{" "}
            </div>
          );
        } else return null;
      });
    }
    return renderContext;
  };

  // numberInput-Based: Head Circumference, Height, Weight, BMI
  handleNumberInput = numberPropertyProps => {
    let renderContext = null;
    if (numberPropertyProps) {
      renderContext = numberPropertyProps.map(singleForm => {
        const { id, display, displayName, unitOfMeasure } = singleForm;
        if (display) {
          const { [id]: propValidationObj } = this.state.validate;
          const { errMessage, validation } = propValidationObj;
          return (
            <div key={id} className={id}>
              <label>
                {" "}
                {displayName}{" "}
                <input
                  name={id}
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />{" "}
                {unitOfMeasure}{" "}
              </label>{" "}
              {validation === false && errMessage ? (
                <h6 className="input-error-number"> {errMessage} </h6>
              ) : null}{" "}
            </div>
          );
        }
        return null;
      });
    }
    return renderContext;
  };

  // selector-Based: gender
  handleSelectorInput = selectorPropertyProps => {
    let renderContext = null;
    if (selectorPropertyProps) {
      renderContext = selectorPropertyProps.map(singleForm => {
        const { id, display, displayName, options } = singleForm;
        if (display) {
          return (
            <div key={id} id={id}>
              <label>
                {" "}
                {displayName}{" "}
                <select
                  name={id}
                  value={this.state.gender}
                  onChange={this.handleChange}
                >
                  {options.map(gender => {
                    return (
                      <option key={gender.sortOrder} value={gender.id}>
                        {" "}
                        {gender.name}{" "}
                      </option>
                    );
                  })}{" "}
                </select>{" "}
              </label>{" "}
            </div>
          );
        }
        return null;
      });
    }
    return renderContext;
  };

  handleChange = event => {
    event.preventDefault();
    const formName = event.target.name;

    this.setState({
      [formName]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const props = this.props.formProps.dataElements;
    const { weight, height, validate } = this.state;
    const compose = (...fns) =>
      fns.reduce((f, g) => (...args) => f(g(...args)));

    const textInputValidator = propId => {
      const { [propId]: name } = this.state;
      if (name.length === 0) {
        return {
          validation: false,
          errMessage: `Please input your name in ${propId.toUpperCase()}!`
        };
      }

      return name.split(" ").length === 2
        ? {
            validation: true,
            errMessage: ""
          }
        : {
            validation: false,
            errMessage: `Please make sure the input ${propId.toUpperCase()} has been separated by a space, for example, "John citizen" `
          };
    };

    const numberInputValidator = (props, propId) => {
      const { [propId]: value } = this.state;
      const { bounds, unitOfMeasure } = props.filter(
        prop => prop.id === propId
      )[0];
      const { upperLimit } = bounds;
      if (value < 0)
        return {
          validation: false,
          errMessage: `Please input a number in ${propId.toUpperCase()}!`
        };
      else if (isNaN(propId) && value <= upperLimit) {
        return {
          validation: true,
          errMessage: ""
        };
      }
      return {
        validation: false,
        errMessage: `Please check in ${propId.toUpperCase()} and make sure the input number below ${upperLimit} ${unitOfMeasure}. `
      };
    };

    // IFFE calling the validation function
    ((validate, props) => {
      let validateObj = validate;
      for (let simplePropNeedValidate in validate) {
        const { id: validationPropId, type: validationPropType } = props.filter(
          prop => simplePropNeedValidate === prop.id
        )[0];
        let validation = false;
        if (validationPropType === "textInput") {
          validation = textInputValidator(validationPropId);
        } else if (validationPropType === "numberInput") {
          validation = numberInputValidator(props, validationPropId);
        }
        validateObj[validationPropId] = validation;
      }
      this.setState({
        validate: validateObj
      });
      return validateObj;
    })(validate, props);

    const convertToJson = () => {
      const bmi = (parseFloat(weight) / parseFloat(height / 100) ** 2).toFixed(
        1
      );
      return props.reduce((accObj, currentProp) => {
        let { id, type } = currentProp;
        let { [id]: value } = this.state;
        // eslint-disable-next-line no-self-assign
        if (type === "numberInput" || type === "select") {
          value = parseInt(value, 10);
        }
        id === "bmi" ? (accObj[id] = parseFloat(bmi)) : (accObj[id] = value);
        return accObj;
      }, {});
    };

    const validJsonOutPut = validJson => {
      for (let singleValidation in validate) {
        if (validate[singleValidation].validation === false) {
          console.log(
            "After validation checking, the form is not valid, hence there is no output JSON :("
          );
          return;
        }
      }
      console.log(
        "------------------------  Below is valid output JSON   ------------------------"
      );
      console.log(validJson);
      console.log(
        "------------------------  Above is valid output JSON   ------------------------"
      );
      return;
    };

    compose(
      validJsonOutPut,
      convertToJson
    )();
    event.preventDefault();
  };

  render() {
    let context = "loading form...";

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
      context = (
        <div className="form-group container-center">
          <form onSubmit={this.handleSubmit}>
            <h4> {this.state.observationName} </h4>{" "}
            {textInputPropsArray
              ? this.handleTextInput(textInputPropsArray)
              : null}{" "}
            {numberInputPropsArray
              ? this.handleNumberInput(numberInputPropsArray)
              : null}{" "}
            {selectorPropsArray
              ? this.handleSelectorInput(selectorPropsArray)
              : null}{" "}
            <input type="submit" value="Submit" />
          </form>{" "}
        </div>
      );
    }
    return context;
  }
}

export default Form;
