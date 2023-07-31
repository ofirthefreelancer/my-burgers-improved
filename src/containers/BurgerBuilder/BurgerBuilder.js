import React, { Component, Fragment } from "react";
import Burger from "./../../components/Burger/Burger";
import BuildControls from "./../../components/Burger/BuildConrols/BuildControls";
import Modal from "./../../components/UI/Modal/Modal";
import OrderSummary from "./../../components/Burger/OrderSummary/OrderSummary";
import axios from "./../../axios-orders";
import Spinner from "./../../components/UI/Spinner/Spinner";
import WithErrorHandler from "./../../hoc/withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as actions from "./../../store/actions/index";

// import {} from "react-router-dom";

class BurgerBuilder extends Component {
  state = {
    purchasable: false,
    purchasing: false,
  };

  componentDidMount() {
    this.props.onInitIngredient();
  }

  updatePurchasableState = (ingredient) => {
    const sum = Object.keys(ingredient)
      .map((igKey) => {
        return ingredient[igKey];
      })
      .reduce((cur, item) => {
        return cur + item;
      }, 0);
    return sum > 0;
  };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({
        purchasing: true,
      });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  closePurchaseHandler = () => {
    this.setState({
      purchasing: false,
    });
  };

  continueOrderHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = {
      ...this.props.ings,
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.props.error ? (
      <p>Ingredients can't be loaded</p>
    ) : (
      <div className="flex justify-center items-center p-5 h-[100%]">
        <Spinner />
      </div>
    );
    let orderSummary = null;

    if (this.props.ings) {
      burger = (
        <>
          <Burger ingredient={this.props.ings} />
          <BuildControls
            addIngredient={(igName) => this.props.onAddIngredient(igName)}
            removeIngredient={(igName) => this.props.onRemoveIngredient(igName)}
            disabled={disabledInfo}
            price={this.props.price}
            isAuth={this.props.isAuthenticated}
            purchasable={this.updatePurchasableState(this.props.ings)}
            ordered={this.purchaseHandler}
          />
        </>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          cancelOrder={this.closePurchaseHandler}
          continueOrder={this.continueOrderHandler}
          price={this.props.price}
        />
      );
    }

    return (
      <Fragment>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.closePurchaseHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredient,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    onAddIngredient: (ingName) => dispatch(actions.addIngredient(ingName)),
    onRemoveIngredient: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    onInitIngredient: () => dispatch(actions.initIngredient()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(WithErrorHandler(BurgerBuilder, axios));
