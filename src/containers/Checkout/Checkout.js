import React, { Component } from "react";
import CheckoutSummary from "./../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Checkout extends Component {
  checkoutCancelHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinueHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };
  render() {
    let summary = <Redirect to="/" />;
    const purchaseAvailabe = this.props.purchased ? <Redirect to="/" /> : null;
    if (this.props.ings) {
      summary = (
        <div>
          {purchaseAvailabe}
          <CheckoutSummary
            ingredient={this.props.ings}
            cancelCheckout={this.checkoutCancelHandler}
            continueCheckout={this.checkoutContinueHandler}
          />
          <Route
            path={this.props.match.path + "/contact-data"}
            component={ContactData}
          />
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredient,
    purchased: state.order.purchased,
  };
};

export default connect(mapStateToProps)(Checkout);
