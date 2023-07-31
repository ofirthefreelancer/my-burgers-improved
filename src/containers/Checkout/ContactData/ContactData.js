import React, { Component } from "react";
import Button from "./../../../components/UI/Button/Button";
import Spinner from "./../../../components/UI/Spinner/Spinner";
import Input from "./../../../components/UI/Input/Input";
import styles from "./ContactData.module.css";
import { connect } from "react-redux";
import * as actions from "./../../../store/actions/index";
import "react-credit-cards/es/styles-compiled.css";
import PaymentForm from "../PaymentForm/PaymentForm";

class ContactData extends Component {
  state = {
    afterorder: false,
    isPayed: false,
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Mail",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Country",
        },
        value: "",
        validation: {
          required: true,
          minLength: 3,
          maxLength: 8,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Zip Code",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },

      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        validation: {},
        valid: true,
      },
    },
    formIsValid: false,
  };
  componentDidUpdate(prevProps, newProps) {
    console.log(prevProps);
    console.log(newProps);
  }
  afterPaymentHandler = (e) => {
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] =
        this.state.orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredient: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId,
    };

    this.props.onOrderBurger(order, this.props.token);
  };
  orderHandler = (e) => {
    this.setState({ afterorder: true });
    e.preventDefault();
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  };

  inputChangeHandler = (e, formElementIdentifier) => {
    const newOrderForm = {
      ...this.state.orderForm,
    };
    const updatedOrderForm = {
      ...newOrderForm[formElementIdentifier],
    };

    updatedOrderForm.value = e.target.value;
    updatedOrderForm.valid = this.checkValidity(
      updatedOrderForm.value,
      updatedOrderForm.validation
    );
    updatedOrderForm.touched = true;
    newOrderForm[formElementIdentifier] = updatedOrderForm;

    let formIsValid = true;
    for (let identifier in newOrderForm) {
      formIsValid = newOrderForm[identifier].valid && formIsValid;
    }

    this.setState({ orderForm: newOrderForm, formIsValid: formIsValid });
  };
  changePayedHandler = (val) => {
    this.setState({
      isPayed: val,
    });
    this.afterPaymentHandler();
  };
  render() {
    let formElementArray = [];
    for (let key in this.state.orderForm) {
      formElementArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }
    let paymentform = <PaymentForm changePayed={this.changePayedHandler} />;
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementArray.map((formElement) => {
          return (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              inValid={!formElement.config.valid}
              shouldValidation={formElement.config.validation}
              touched={formElement.config.touched}
              changed={(e) => this.inputChangeHandler(e, formElement.id)}
            />
          );
        })}

        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={styles.ContactData}>
        {this.state.afterorder ? (
          <div>{paymentform}</div>
        ) : (
          <div>
            <h4>Fill Your Contact Data Information!</h4>
            {form}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredient,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (order, token) =>
      dispatch(actions.purchaseBurger(order, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactData);
